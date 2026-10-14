---
title: IPv4 ve IPv6 Mimarisi, Alt Ağ Yönetimi ve Başlık Analizi
sidebar:
  order: 2
  label: "2.2  IPv4 ve IPv6 Paket Anatomisi"
---

# IPv4 ve IPv6 Mimarisi, Alt Ağ Yönetimi ve Başlık Analizi

İnternet Protokolü (IP), modern ağların temel taşıyıcı kolonudur. OSI modelinin 3. Katmanında (Ağ Katmanı) ve TCP/IP modelinin İnternet Katmanında çalışan IP; paketlerin kaynak düğümden hedef düğüme farklı ağlar ve otonom sistemler (AS) üzerinden uçtan uca yönlendirilmesini sağlar.

IP protokolü doğası gereği **bağlantısız (connectionless)** ve **güvensizdir (best-effort delivery)**. IP'nin kendisi paketin hedefe ulaşıp ulaşmadığını doğrulamaz; bu görev gerekiyorsa Katman 4'te çalışan TCP'ye bırakılır.

![IP, Taşıma Katmanı ve ICMP için Teslimat Hizmeti Sunar](./1_T7ew3u6ttBWwa5NsNgjR3g.webp)

---

## §2.2.1. IPv4 Paket Anatomisi ve Başlık Alanları

Standart bir IPv4 başlığı opsiyonlar hariç **20 bayt (160 bit)** uzunluğundadır:

```mermaid
packet-beta
0-3: "Version (4)"
4-7: "IHL"
8-13: "DSCP"
14-15: "ECN"
16-31: "Total Length (16 bit)"
32-47: "Identification (16 bit)"
48-50: "Flags (DF, MF)"
51-63: "Fragment Offset (13 bit)"
64-71: "Time to Live - TTL (8 bit)"
72-79: "Protocol (8 bit - TCP:6, UDP:17)"
80-95: "Header Checksum (16 bit)"
96-127: "Source IP Address (32 bit)"
128-159: "Destination IP Address (32 bit)"
```

![Wireshark Üzerinde IPv4 Başlık Alanlarının Ayrıntılı İncelenmesi](./1_GJHqitNsY8XKz2li3lXVDQ.webp)

### Kritik Başlık Alanlarının Fonksiyonları:

1. **Version (4 bit):** Protokol sürümünü gösterir (`4` = IPv4).
2. **IHL (Internet Header Length - 4 bit):** Başlığın 32-bitlik kelime cinsinden uzunluğudur. Opsiyonsuz başlık için değer `5`'tir ($5 \times 4 = 20\text{ bayt}$).
3. **DSCP / ECN (8 bit):** Hizmet Kalitesi (QoS) ve ağ tıkanıklığı bildirimi için kullanılır.
4. **Total Length (16 bit):** Başlık ve veriyi (payload) kapsayan tüm paketin bayt cinsinden boyutudur (Maksimum 65.535 bayt).
5. **Identification, Flags ve Fragment Offset:** Paket parçalama (fragmentation) mekanizması için kullanılır.
   - **DF (Don't Fragment):** `1` ise yönlendiriciler paketi bölemez; MTU aşılırsa paket atılır.
   - **MF (More Fragments):** `1` ise arkadan gelen parçalar olduğunu, `0` ise son parça olduğunu belirtir.
6. **Time to Live (TTL - 8 bit):** Yönlendirme döngülerini (routing loops) engellemek için her yönlendirici geçişinde (hop) 1 azaltılır. Değer `0`'a ulaştığında yönlendirici paketi düşürür ve kaynağa `ICMP Time Exceeded (Type 11)` döner.
7. **Protocol (8 bit):** Üst katmanda hangi protokolün taşındığını belirtir:
   - `0x01` (1): **ICMP**
   - `0x06` (6): **TCP**
   - `0x11` (17): **UDP**

---

## §2.2.2. MTU ve Parçalanma (Fragmentation) Analizi

Maksimum İletim Birimi (MTU), bir ağ arayüzünün tek bir çerçevede taşıyabileceği en büyük paket boyutudur (Standart Ethernet için **1500 bayt**).

Bir paket yoldaki daha düşük MTU'ya sahip bir bağlantıya ulaştığında:
1. **DF Biti 0 İse:** Yönlendirici paketi parçalara böler, her parçaya orijinal IP başlığını ve ilgili `Fragment Offset` değerini yazar.
2. **DF Biti 1 İse:** Paket parçalanamaz. Yönlendirici paketi düşürür ve kaynağa `ICMP Type 3 Code 4 (Fragmentation Needed and DF set)` mesajı döner. İstemci bu bilgiyle **Path MTU Discovery (PMTUD)** yaparak paket boyutunu küçültür.

![MTU Sınırı ve Paket Parçalanması](./1_Gmy9Pgg9xp9UlBITMfwglg.webp)

![Wireshark ile IP Parçalarının ve Offset Değerinin Yeniden Birleştirilmesi](./1_6Y7PXca_YiF7g2nbehV6oA.webp)

> [!CAUTION]
> Güvenlik duvarları ICMP Type 3 Code 4 paketlerini gereksiz yere engellerse, "PMTU Black Hole" oluşur. Web sayfaları küçük isteklerle açılırken büyük veri transferlerinde (örneğin dosya indirme veya TLS el sıkışmasında) bağlantı aniden kilitlenir.

![Şüpheli Loopback ve Sahte Adres Trafiği](./1_fLWJpNDw-l0U1eNT73tlaQ.webp)

---

## §2.2.3. IPv6 Mimarisi: Yeni Nesil İnternet Protokolü

IPv4'ün 32-bitlik adres alanının (yaklaşık 4.3 milyar adres) tükenmesi üzerine geliştirilen IPv6, **128-bit adresleme** ($3.4 \times 10^{38}$ adres) sunar.

![IPv6 Katman 3 Yönlendirme Mimarisi](./1_WltOTqu_1iZzyc0O4u5zgg.webp)

![IPv6 Adresleme Formatı ve 16-Bayt Hex Dizilimi](./1_aLNQlmlSWWQnFYKi0MA9rw.webp)

### IPv4 ve IPv6 Karşılaştırması

| Özellik | IPv4 | IPv6 |
| :--- | :--- | :--- |
| **Adres Uzunluğu** | 32 bit (4 bayt) | 128 bit (16 bayt - 8 grup 16-bit hex) |
| **Başlık Boyutu** | Değişken (Min 20 bayt) | **Sabit 40 bayt** (Hızlı ASIC işleme) |
| **Yönlendiricide Parçalama** | Var | **Yok** (Yalnızca kaynak düğüm parçalayabilir) |
| **Broadcast (Yayın)** | Var (Ağı yoran ARP yayınları) | **Yok** (Multicast ve Anycast kullanılır) |
| **Adres Çözümleme** | ARP (RFC 826) | **ICMPv6 NDP (Neighbor Discovery Protocol)** |
| **Otomatik Yapılandırma** | DHCPv4 veya Statik | **SLAAC (Stateless Address Autoconfiguration)** & DHCPv6 |

![ICMPv6 Neighbor Solicitation Paketinin ARP Yerine Geçişi](./1_b6BPriW0o2QQNIce_G74JA.webp)

---

## §2.2.4. IPv6 Geçiş ve Tünelleme Mekanizmaları

IPv4 altyapısından IPv6'ya küresel geçiş sürecinde iki protokolün birlikte çalışabilmesi için geçiş mekanizmaları tasarlanmıştır:

### 1. 6to4 Tünelleme (IPv6 over IPv4)

![6to4 Tünelleme Trafiğinin Wireshark Analizi](./1_wfLk0ygZStuJ43NRGFg65Q.webp)

- IPv6 paketlerini doğrudan bir IPv4 başlığı içine (IP Protokol 41) kapsülleyerek saf IPv4 omurgaları üzerinden taşır.
- `2002::/16` özel adres bloğunu kullanır.

### 2. Teredo Tünelleme (IPv6 over UDP)

![Teredo UDP Tünellemesi ile NAT Arkasından IPv6 İletişimi](./1_W8wVMRwalacSMFyhQtSyfQ.webp)

- 6to4 tünellemesi klasik NAT cihazlarının arkasında çalışamaz çünkü NAT cihazları IP Protokol 41 paketlerini yönlendiremez.
- **Teredo**, IPv6 paketini **UDP Port 3544** paketi içine kapsülleyerek en katı NAT arkasından bile IPv6 bağlantısı kurulabilmesini sağlar.

---

## §2.2.5. Wireshark ile IP Trafiğini Filtreleme

Wireshark ekranında IP düzeyinde analiz yaparken şu filtreler en sık kullanılan araçlardır:

| Filtre Sözdizimi | Açıklama |
| :--- | :--- |
| `ip.addr == 10.0.0.1` | Belirtilen IPv4 adresi kaynak veya hedef olan paketler |
| `ipv6.addr == 2001:db8::1` | Belirtilen IPv6 adresi geçen paketler |
| `ip.flags.df == 1` | Don't Fragment biti işaretli paketler |
| `ip.flags.mf == 1 || ip.frag_offset > 0` | Parçalanmış (fragmented) IP paketleri |
| `ip.ttl <= 2` | TTL değeri tükenmek üzere olan veya yakın yönlendirici paketleri |
| `icmp.type == 3 && icmp.code == 4` | MTU aşımı ve parçalanma engeli bildiren paketler |
| `ipv6` | Saf veya tünellenmiş tüm IPv6 paketleri |
| `udp.port == 3544` | Teredo IPv6 tünelleme trafiği |
| `ip.proto == 41` | 6to4 IPv6 tünelleme trafiği |
