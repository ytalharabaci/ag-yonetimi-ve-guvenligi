---
title: Wireshark ile Ağ Trafik Akışlarını Anlama ve Paket Analizi
sidebar:
  order: 2
  label: "1.2  Wireshark ile Trafik Akışı ve Analiz"
---

# Wireshark ile Ağ Trafik Akışlarını Anlama ve Paket Analizi

Ağ mimarilerini teorik olarak bilmek bir sistemin nasıl tasarlanması gerektiğini gösterir; ancak ağda gerçekte ne olup bittiğini anlamak, performans darboğazlarını çözmek ve siber saldırıları tespit etmek **paket seviyesinde görünürlük** gerektirir.

Wireshark, ağ arayüz kartından (NIC) geçen ham bit dizilerini yakalayarak yüzlerce protokolü katman katman ayrıştıran (dissecting) dünyanın en yaygın paket analiz aracıdır. Bu bölümde, bir istemcinin ağda bir servise bağlanırken attığı adımları, yönlendirici ve anahtarların paket iletim mekanizmalarını ve Wireshark istatistik araçlarıyla canlı PCAP analiz tekniklerini inceleyeceğiz.

```mermaid
sequenceDiagram
    autonumber
    actor Client as İstemci (192.168.1.50)
    participant DNS as DNS Sunucusu (192.168.1.1)
    participant Switch as L2 Switch / ARP
    participant Router as Varsayılan Ağ Geçidi (Router)
    participant Server as FTP Sunucusu (10.0.0.100)

    Note over Client,Server: Adım 1: İsim Çözümleme (DNS)
    Client->>DNS: Standard query A corpfs1.local
    DNS-->>Client: Standard query response A 10.0.0.100

    Note over Client,Router: Adım 2: Ağ Geçidi Donanım Adresi (ARP)
    Client->>Switch: Who has 192.168.1.1? Tell 192.168.1.50 (Broadcast)
    Router-->>Client: 192.168.1.1 is at 00:1a:2b:3c:4d:5e (Unicast)

    Note over Client,Server: Adım 3: TCP 3 Yönlü El Sıkışma
    Client->>Server: [SYN] Seq=0 Win=64240 Len=0 MSS=1460
    Server-->>Client: [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0
    Client->>Server: [ACK] Seq=1 Ack=1 Win=64240 Len=0

    Note over Client,Server: Adım 4: Uygulama İletişimi (FTP)
    Server-->>Client: 220 Service ready for new user.
    Client->>Server: USER anonymous
```

---

## §1.2.1. Yönlendirme ve Anahtarlama Prensipleri

Bir paketin ağ cihazları tarafından iletilmesi, OSI Katman 2 ve Katman 3 donanımlarının karar mekanizmalarına dayanır:

### 1. Anahtarların (Switch) Paket İletim Mantığı

![Anahtarın Hedef MAC Adresine Göre Paket İletimi](./1_NsSETtT4IofH-5OXSKDrzQ.webp)

- Katman 2 anahtarlar, gelen Ethernet çerçevesinin **Hedef MAC (Destination MAC)** adresini inceler.
- Kendi hafızasındaki CAM tablosunda (MAC Address Table) bu adresin hangi fiziksel porta karşılık geldiğine bakar.
- Eşleşme varsa çerçeve doğrudan o porta iletilir (*Unicast*).
- Hedef MAC adresi henüz tabloda yoksa, çerçeveyi girdiği port hariç tüm aktif portlara kopyalar (*Flooding*).

### 2. Yönlendiricilerin (Router) Paket İletim Mantığı

![Yönlendiricinin Hedef IP Adresine Göre Paket İletimi](./1_Utuq1h526m5eoCl4wWYJGQ.webp)

- Yönlendiriciler, gelen paketin **Hedef IP (Destination IP)** adresini yönlendirme tablosuyla (Routing Table / FIB) karşılaştırır.
- En uzun önek eşleşmesi kuralına (*Longest Prefix Match*) göre hedef alt ağa giden çıkış arayüzünü ve bir sonraki atlama (*Next-Hop*) adresini belirler.
- Çerçevenin L2 başlığındaki MAC adreslerini günceller: Kaynak MAC olarak kendi çıkış arayüzünün MAC adresini, hedef MAC olarak ise sıradaki ağ geçidinin MAC adresini yazar. IP başlığındaki TTL değerini 1 azaltır.

### 3. Dinamik Yönlendirme Protokolleri: OSPF vs. BGP

![Statik ve Dinamik Yönlendirme Yaklaşımları](./0_8Q5DoM_nd0PtJKLk.webp)

![İç ve Dış Ağ Geçidi Protokolleri Mimarisi](./0_KO7-ySH9na-aDkyD.webp)

![OSPF ve BGP Protokollerinin Karşılaştırmalı Analizi](./1_FlgrJqdasUCOHJ1RQvVpGQ.webp)

| Kriter | OSPF (Open Shortest Path First) | BGP (Border Gateway Protocol) |
| :--- | :--- | :--- |
| **Kategori** | IGP (İç Ağ Geçidi Protokolü) | EGP (Dış Ağ Geçidi Protokolü) |
| **Algoritma** | Link-State (Dijkstra SPF) | Path-Vector |
| **Ölçek** | Kurumsal LAN ve Otonom Sistem (AS) içi | Küresel İnternet Omurgası ve AS'ler arası |
| **Metrik** | Maliyet (Bant Genişliği - Cost) | BGP Nitelikleri (AS-Path, Local Pref, MED) |
| **Yakınsama (Convergence)** | Çok Hızlı (Saniyeler içinde) | Yavaş (Politika tabanlı, dakikalar sürebilir) |
| **Protokol / Port** | IP Protokol 89 | TCP Port 179 |

---

## §1.2.2. Wireshark Arayüz Anatomisi ve Paket Yakalama Mekaniği

Bir ağ analiz aracının trafiği inceleyebilmesi için işletim sisteminin çekirdeğindeki paket filtreleme sürücüleriyle (Windows'ta `Npcap`, Linux'ta `libpcap`) haberleşmesi gerekir.

![TCP/IP Modeli ve OSI Modeli Öğeleri](./1_X4_tzi-NjihAqIAJEunVWA.webp)

### Arayüz Modları
- **Normal Mod:** Ağ kartı yalnızca hedefi kendi MAC adresi olan veya genel yayın (Broadcast/Multicast) çerçevelerini kabul eder; diğerlerini donanım seviyesinde atar.
- **Promiscuous (Karma) Mod:** Ağ kartı donanımsal MAC filtrelemesini kapatır. Fiziksel ortama düşen tüm çerçeveleri hedef MAC adresine bakılmaksızın yakalayıp Wireshark'a iletir. Switched ağlarda diğer sunucuları dinlemek için **Port Mirroring / SPAN** gerekir.

---

## §1.2.3. Canlı Trafik Akış Senaryosu: İstemci — FTP Sunucu İletişimi

Bir kullanıcının komut satırından `ftp CORPFS1` yazdığı anda arka planda çalışan çözümleme süreçleri şöyledir:

![Kaynak ve Hedef Bağlantı Noktası Numaraları](./1_tCpXIwj6CXujGOtmMVR_pA.webp)

![TCP/IP Çözümleme Süreçleri ve Adım Adım Analiz](./1_AWmwmBOwxbf1QyEXXsjg0Q.webp)

![İstemci ve FTP Sunucu Bağlantı Şeması](./1_cPS6KAp-bJl1xjrg96dEMg.webp)

### Adım 1: Port Numarası Çözümleme
İstemci işletim sistemi, `ftp` uygulamasının hangi port üzerinden haberleşeceğini öğrenmek için yerel servis veritabanını (`/etc/services` veya `C:\Windows\System32\drivers\etc\services`) kontrol eder. FTP kontrol oturumunun hedef portunun `TCP 21` olduğunu belirler. İstemci, giden paket için işletim sisteminden geçici (ephemeral) dinamik bir kaynak port (Örn: `49152`) tahsis eder.

### Adım 2: Ağ Adı Çözümlemesi (DNS)
Kullanıcı bir IP adresi yerine isim (`CORPFS1`) belirttiği için istemci DNS sorgusu üretir:
1. Yerel DNS önbelleğini kontrol eder (`ipconfig /displaydns`).
2. Yerel `hosts` dosyasını inceler.
3. Ağdaki yapılandırılmış DNS sunucusuna `Standard Query A CORPFS1` paketi yollar.
4. Gelen yanıtta sunucunun IP adresi (Örn: `192.168.1.100`) elde edilir.

### Adım 3: Yerel Donanım Adresi Çözümlemesi (ARP)
İstemci, hedef IP adresinin kendi yerel ağında olduğunu tespit ettiğinde L2 çerçevesini oluşturmak için hedef MAC adresine ihtiyaç duyar:
- İstemci ARP tablosuna (`arp -a`) bakar.
- Eşleşme yoksa ağa genel yayın (*Broadcast - FF:FF:FF:FF:FF:FF*) olarak `ARP Request` paketi yollar.
- Hedef sunucu istemciye doğrudan (*Unicast*) olarak `ARP Reply` cevabını verir.

### Adım 4: Rota Çözümlemesi (Uzak Ağlar İçin)
Hedef sunucu farklı bir alt ağda veya internette yer alıyorsa, istemci yönlendirme tablosuna bakarak varsayılan ağ geçidini (*Default Gateway*) seçer. Paketin hedef IP adresine sunucunun IP adresini yazar; ancak çerçevenin hedef MAC adresine **yönlendiricinin arayüz MAC adresini** yerleştirir.

### Adım 5: TCP 3 Yönlü El Sıkışma
IP ve MAC adresleri çözüldükten sonra güvenilir taşıma oturumu başlatılır:
- **SYN:** İstemci rastgele bir Sequence Number (Seq=0) ve MSS gibi TCP opsiyonları içeren SYN paketi gönderir.
- **SYN-ACK:** Sunucu bağlantıyı kabul ettiğini belirten kendi Seq numarasını ve istemcinin Seq değerini 1 artırarak (Ack=1) yanıt verir.
- **ACK:** İstemci onayı tamamlar; oturum **ESTABLISHED** durumuna geçer.

### Adım 6: Uygulama İletişimi
Bağlantı kurulur kurulmaz sunucu `220 Microsoft FTP Service` hoşgeldiniz mesajını iletir ve istemci kimlik doğrulama komutlarını (`USER`, `PASS`) aktarır.

---

## §1.2.4. PCAP Paket Dosyası Analizi ve Wireshark İstatistik Araçları

Bir ağ uzmanının yüzbinlerce paketlik bir PCAP yakalama dosyasını incelerken ilk başvuracağı yöntemler Wireshark istatistik menüleridir:

### 1. Başlangıç DNS Sorguları ve DNS Önbellek Davranışı

![PCAP Başlangıcındaki DNS Sorguları](./1_iUj1JBtBuMGtEUw5Y6zaCg.webp)

- İlk kez ziyaret edilen bir hedef için pcap dosyasının başında muhakkak DNS `A` ve `AAAA` sorguları görülür (`http-riverbed-one.pcapng`).

![DNS Önbellek Sayesinde DNS Sorgusu Olmayan Trafik Akışı](./1_6zV7mvLrjJnykjirRuBkdQ.webp)

- İkinci bağlantı denemesinde (`http-riverbed-two.pcapng`) DNS sorguları yer almaz; çünkü istemci işletim sistemi IP adresini önbelleğe almıştır.

![DNS TTL Süresinin Dolmasıyla Tekrar Eden Sorgular](./1_SodfEwNqxAcl739FUVO_kA.webp)

- DNS yanıtındaki TTL (Time To Live) süresi dolduğunda, tarayıcı veya istemci servisi ismi yeniden çözümlemek için ağa yeni bir DNS sorgusu yollar.

### 2. Protokol Hiyerarşisi (Protocol Hierarchy)

![Wireshark Protokol Hiyerarşisi İstatistiği](./1_zal0jQY1slYuV6RDm5UdCg.webp)

- **Statistics $\rightarrow$ Protocol Hierarchy** menüsü, yakalanan tüm trafiğin protokol bazlı dağılımını yüzde ve paket sayısı olarak verir.
- Ağdaki anormal yayın fırtınaları (Broadcast Storms), beklenmedik UDP taşmaları veya şüpheli tüneller saniyeler içinde bu ekranda fark edilir.

### 3. Konuşmalar (Conversations) ve Uç Noktalar (Endpoints)

![Wireshark Conversations Ekranı](./1_Hb4M03jKQ_8Lp1YzMShv2Q.webp)

![Wireshark Endpoints Ekranı](./1_5XvOPLu2866hRTPDdvUjig.webp)

- **Statistics $\rightarrow$ Conversations:** Hangi iki cihaz arasında en çok veri aktarıldığını (Bayt ve Paket cinsinden) listeler. En çok konuşan (Top Talker) saldırgan veya arızalı sunucuyu tespit etmek için birincil ekrandır.
- **Statistics $\rightarrow$ Endpoints:** Trafiğe katılan tüm tekil IP, MAC ve TCP/UDP portlarını coğrafi ve sayısal olarak döker.

### 4. HTTP İstekleri ve Akış Takibi (Follow Stream)

![Wireshark HTTP Requests İstatistiği](./1_2QwpmwBds_gI3oZfGyMGKA.webp)

![Dominant Trafik Filtresi ile Paketleri Ayrıştırma](./1_MkagBTP5iI4imfNHp5V5nw.webp)

![Follow HTTP Stream ile Trafiği Metin Olarak Yeniden Birleştirme](./1_-2JPla-66SZrjX-kKCsECg.webp)

![Uzun HTTP Akışının Ayrıntılı Analizi](./1_4B5HtycWS34GEws6jMxlnA.webp)

- **Statistics $\rightarrow$ HTTP $\rightarrow$ Requests:** PCAP içindeki tüm web isteklerinin URL ve host dökümünü çıkarır.
- Bir pakete sağ tıklayıp **Follow $\rightarrow$ HTTP Stream** (veya TCP Stream) dendiğinde, Wireshark tüm TCP segmentlerini sıralı olarak birleştirir ve istemci (kırmızı) ile sunucu (mavi) arasındaki tüm konuşmayı ham metin olarak ekrana getirir.

---

## §1.2.5. Güvenlik Duvarı ve NAT Etkisi

Paket analizi yaparken paketlerin geçtiği ara cihazların başlıkları nasıl değiştirdiğini bilmek hayati önem taşır:

![Güvenlik Duvarı ve Katman 3 Paket İncelemesi](./1_0sZI8QkhS5eWd1ef0qJyXw.webp)

- **Ağ Adresi Dönüştürme (NAT):** Özel IP (RFC 1918) bloklarındaki istemcilerin internete çıkışında, kaynak IP genel (Public) IP ile değiştirilir. Bir analist, NAT cihazının iç bacağında `192.168.1.50` gördüğü trafiği, dış bacakta `203.0.113.5` olarak görür. Bu iki akışı eşleştirmek için TCP portları ve zaman damgaları korele edilmelidir.
- **Port Adresi Dönüştürme (PAT):** Tek bir genel IP üzerinden binlerce istemcinin çıkışını sağlamak için kaynak port numaraları da dinamik olarak yeniden yazılır.

---

## §1.2.6. Temel Wireshark Ekran Filtreleri (Display Filters)

Wireshark'ta binlerce paket arasından kritik bilgiyi çekmek için ekran filtreleri kullanılır:

| Filtre Sözdizimi | Açıklama |
| :--- | :--- |
| `ip.addr == 192.168.1.100` | Kaynağı veya hedefi belirtilen IP olan tüm paketler |
| `ip.src == 192.168.1.50 && ip.dst == 192.168.1.100` | İki uç nokta arasındaki belirli yönlü trafik |
| `tcp.port == 21 || tcp.port == 20` | FTP kontrol ve veri aktarım paketleri |
| `arp` | Yalnızca ARP istek ve yanıtları |
| `dns` | Yalnızca DNS sorgu ve cevapları |
| `tcp.flags.syn == 1 && tcp.flags.ack == 0` | Yalnızca yeni bağlantı başlatma (SYN) paketleri |
| `http.request.method == "POST"` | Yalnızca HTTP POST istekleri |
| `frame contains "USER"` | Paket yükünde (payload) "USER" ifadesi geçenler |

> [!TIP]
> Paket analizi yaparken şüpheli bir oturumu incelemenin en hızlı yolu `tcp.stream eq X` filtresidir. İlgili akışa sağ tıklayıp "Follow $\rightarrow$ TCP Stream" seçildiğinde bu filtre otomatik uygulanır.
