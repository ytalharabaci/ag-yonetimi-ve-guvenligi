---
title: HTTP/HTTPS Komuta Kontrol (C2) Kanalları ve Beaconing Analizi
sidebar:
  order: 2
  label: "7.2  HTTP/HTTPS C2 ve Beaconing Analizi"
---

# HTTP/HTTPS Komuta Kontrol (C2) Kanalları ve Beaconing Analizi

Modern hedefli siber saldırılarda (APT) kullanılan zararlı yazılımların ve kırmızı takım araçlarının (Cobalt Strike, Sliver, Havoc, Mythic, Brute Ratel) ezici çoğunluğu, komuta kontrol (C2 / C&C) iletişimi için standart **HTTP (Port 80)** ve **HTTPS (Port 443)** protokollerini kullanır.

Saldırganlar kurumsal ağın güvenlik duvarı ve vekil sunucu (Proxy) kurallarını aşmak için trafiği meşru bir web gezintisi kılığına sokar. Bu gizli iletişimin en temel karakteristik davranışı **"Beaconing" (İşaret Verme)** mekanizmasıdır.

```mermaid
sequenceDiagram
    autonumber
    actor Implant as Zararlı Ajan (Kurban PC)
    actor Proxy as Kurumsal Proxy / Firewall
    actor C2 as Dış C2 Sunucusu

    loop Her 60 Saniyede Bir (+-%20 Jitter)
        Implant->>Proxy: HTTPS GET /api/v1/update (Ben buradayım, görev var mı?)
        Proxy->>C2: İsteği İletir
        C2-->>Proxy: HTTP 200 OK (Boş Yanıt - Görev Yok)
        Proxy-->>Implant: İletir
    end

    Note over C2: Saldırgan Panelden Yeni Bir Görev Yazar: "Hashdump"
    Implant->>Proxy: HTTPS GET /api/v1/update
    Proxy->>C2: İsteği İletir
    C2-->>Proxy: HTTP 200 OK {Command: "mimikatz..."}
    Proxy-->>Implant: Görev Alındı!
    Note over Implant: Komut Çalıştırılır ve Sonuçlar POST ile Gönderilir
    Implant->>Proxy: HTTPS POST /api/v1/submit (Şifreli Veri)
    Proxy->>C2: Veri Sızdırıldı!
```

---

## §7.2.1. Beaconing Davranışı ve "Jitter" Matematiksel Analizi

Bir kurbana bulaşan ajan (implant), dışarıdaki C2 sunucusuna sürekli açık bir TCP soketi tutmaz; çünkü saatlerce açık kalan soketler güvenlik analistlerinin dikkatini çeker. Bunun yerine **periyodik olarak uyanır, sunucuya yeni bir emir olup olmadığını sorar ve tekrar uyku moduna geçer (Sleep)**.

### Jitter (Rastgele Sapma) Matematiği:
Eğer ajan tam olarak her 60.00 saniyede bir istek atarsa, iki bağlantı arasındaki zaman farkı ($\Delta t$) sabittir:
$$\Delta t_i = t_i - t_{i-1} = 60s$$

Bu durum sıfır varyans ($\sigma^2 = 0$) üretir ve SIEM analitiklerinde anında alarm üretir. Saldırganlar bu tespiti geciktirmek için **Jitter ($J$)** ekler:
$$t_{\text{sleep}} = T_{\text{base}} \times (1 \pm J \times R), \quad R \in [0, 1]$$

Örneğin $T_{\text{base}} = 60s$ ve $J = 0.20$ ise uyku süresi $48s$ ile $72s$ arasında rastgele dağılır. Ancak binlerce istek boyunca incelendiğinde bu dağılım bir **Normal Dağılım veya Düzgün Dağılım** eğrisi oluşturur; insan gezintisindeki (rastgele Poisson dağılımı) kaotik davranıştan matematiksel olarak kolayca ayrıştırılır.

---

## §7.2.2. Ağ Trafiğinde C2 Anomalileri ve Parmak İzleri

Bir SOC analisti veya tehdit avcısı, şifreli web trafiği içinde C2 işaretlerini şu anomalilerle yakalar:

### 1. User-Agent ve Başlık Tutarsızlıkları
Zararlı yazılımlar genellikle işletim sisteminin yerel HTTP kütüphanelerini veya özel kodlanmış soketleri kullanır:
- Windows üzerinde çalışan bir uygulamanın `curl/7.68.0`, `Go-http-client/1.1` veya eski bir `Mozilla/4.0` User-Agent'ı göndermesi şüphelidir.
- Standart tarayıcıların gönderdiği `Accept-Language`, `Sec-Ch-Ua`, `Sec-Fetch-Dest` gibi modern güvenlik başlıklarının eksik olması.

### 2. URI ve İstek Deseni Anomalileri
- Belirli bir harici IP veya yeni kaydedilmiş alan adına (Newly Registered Domain - NRD) günün 24 saati boyunca kesintisiz olarak küçük boyutlu GET ve POST isteklerinin akması.
- Yanıt boyutlarının sabit olması (Örn: Görev olmadığında sürekli aynı 0 veya 4 baytlık yanıtlar).

### 3. JA3 ve JA4+ TLS Parmak İzi (Fingerprinting)
Yük şifreli olsa bile, istemcinin TLS el sıkışmasında gönderdiği `Client Hello` paketindeki şifre paketleri (Cipher Suites), uzantılar ve eliptik eğri parametreleri o istemci yazılımının parmak izini çıkarır (**JA3 Hash**).
- **JA4 (John Althouse 2023):** JA3'ün yerini alan modern standarttır. İstemci protokolünü (TCP/QUIC), TLS versiyonunu, SNI varlığını ve şifreleme algoritmalarını insan tarafından okunabilir bir özet haline getirir.
- Örneğin tipik bir Go tabanlı C2 ajanı: `t13d1516h2_...` şeklinde başlarken, güncel bir Google Chrome tarayıcısı tamamen farklı bir JA4 hash'i üretir.

---

## §7.2.3. Cobalt Strike Malleable C2 Profil İncelemesi

Saldırganlar, tespit edilmemek için C2 trafiğini meşru servisler (Amazon, jQuery, Microsoft Update) gibi gösterecek profiller tanımlarlar:

```text
# Örnek Malleable C2 Profili Parçası
http-get {
    set uri "/api/v2/telemetry";
    client {
        header "Host" "support.cdn-service.net";
        header "User-Agent" "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...";
        metadata {
            base64url;
            prepend "session_id=";
            header "Cookie"; # Kurban kimliği Cookie içine gizlenir!
        }
    }
    server {
        header "Content-Type" "application/json";
        output {
            prepend '{"status":"ok","data":"';
            append '"}';
            print;
        }
    }
}
```

Analistler bu tür profilleri tespit etmek için:
- Cookie alanında anlamsız yüksek entropili Base64 karakter dizilerini,
- Sunucu yanıtında her seferinde aynı şablon JSON içine gömülen şifreli baytları denetler.

---

## §7.2.4. Python ile Zeek conn.log Üzerinden Beaconing Tespiti

Aşağıdaki Python betiği, Zeek `conn.log` dosyasını okuyarak iki IP arasındaki bağlantı zaman farklarının standart sapmasını ve varyans katsayısını hesaplar; beaconing şüphesi olan hedefleri puanlar:

```python
import pandas as pd
import numpy as np

def detect_beaconing(conn_log_path, min_connections=20):
    # Zeek conn.log dosyasını yükleme
    df = pd.read_csv(conn_log_path, sep='\t', comment='#', 
                     names=['ts', 'uid', 'id.orig_h', 'id.orig_p', 'id.resp_h', 'id.resp_p', 
                            'proto', 'service', 'duration', 'orig_bytes', 'resp_bytes', 'conn_state'])
    
    # Dış hedeflere göre gruplama
    grouped = df.groupby(['id.orig_h', 'id.resp_h'])
    
    results = []
    for (src, dst), group in grouped:
        if len(group) < min_connections:
            continue
        
        # Bağlantılar arası süre farkı (Delta t)
        timestamps = np.sort(group['ts'].values)
        deltas = np.diff(timestamps)
        
        mean_delta = np.mean(deltas)
        std_delta = np.std(deltas)
        cv = std_delta / mean_delta if mean_delta > 0 else 1.0  # Varyans Katsayısı
        
        # Düşük CV (0.0 - 0.25) düzenli beaconing göstergesidir!
        if cv < 0.25:
            score = round((1.0 - cv) * 100, 2)
            results.append({
                'Source_IP': src,
                'Dest_IP': dst,
                'Connection_Count': len(group),
                'Mean_Interval_Sec': round(mean_delta, 1),
                'Jitter_CV': round(cv, 3),
                'Beacon_Confidence_Score': f"%{score}"
            })
            
    return pd.DataFrame(results).sort_values(by='Jitter_CV')

# print(detect_beaconing('conn.log'))
```

---

## §7.2.5. Wireshark ile Beaconing Tespiti Pratikleri

1. **Zaman Delta Grafikleri (I/O Graphs):**
   - Wireshark menüsünden **Statistics $\rightarrow$ I/O Graphs** açılır.
   - Y-ekseninde `Packets`, X-ekseninde `1 sec` seçilir. Şüpheli hedef IP için `ip.addr == <hedef>` filtresi girildiğinde, grafikte düzenli aralıklarla yükselen nabız çubukları (Heartbeat) açıkça görülür.
2. **TCP Delta Time Filtresi:**
   - Paket listesine `tcp.time_delta` sütunu eklenir. İki paket arasındaki sürenin sürekli 59-61 saniye bandında kaldığı oturumlar filtrelenir:
   ```text
   http.request && (frame.time_delta >= 48 && frame.time_delta <= 72)
   ```
3. **Conversations Özeti:**
   - **Statistics $\rightarrow$ Conversations $\rightarrow$ IPv4** sekmesinde, paket sayısı binleri bulmasına rağmen toplam aktarılan bayt miktarının 100-200 KB civarında kaldığı uzun ömürlü bağlantılar izole edilir.

---

## §7.2.6. Çapraz Referans ve Entegrasyon
- DNS ve ICMP tünelleri üzerinden veri sızıntısı analizi için [§7.1 DNS ve ICMP Gizli Tünelleri](./01-dns-ve-icmp-gizli-tunelleri.md) bölümüne bakın.
- Proaktif tehdit avcılığı metodolojisi için [§7.3 Wireshark ile Tehdit Avcılığı Rehberi](./03-wireshark-ile-proaktif-tehdit-avciligi-rehberi.md) bölümünü inceleyin.
- Siber Güvenlik Operasyonları Kitabı'nda CTI ve Aldatma Teknolojileri için [Siber Tehdit İstihbaratı ve Aldatma](../../../siber-guvenlik-operasyonlari/14-operasyonel-guvenlik/03-tehdit-istihbarati.md) bölümüne bakın.
