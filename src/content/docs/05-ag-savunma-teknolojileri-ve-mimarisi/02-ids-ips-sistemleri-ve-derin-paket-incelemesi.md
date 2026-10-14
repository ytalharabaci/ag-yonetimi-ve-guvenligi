---
title: Saldırı Tespit/Önleme Sistemleri (IDS/IPS) ve Derin Paket İncelemesi
sidebar:
  order: 2
  label: "5.2  IDS/IPS ve Derin Paket İncelemesi"
---

# Saldırı Tespit/Önleme Sistemleri (IDS/IPS) ve Derin Paket İncelemesi

Ağ Güvenlik Duvarları trafiğin hangi IP ve porttan aktığını denetler; ancak izin verilen bir port üzerinden (örneğin port 443 veya 80) sisteme sızmaya çalışan bir SQL Enjeksiyonu, Buffer Overflow veya uzaktan kod çalıştırma (RCE) saldırısını tespit edemez.

Bu noktada devreye giren **Saldırı Tespit Sistemleri (IDS - Intrusion Detection System)** ve **Saldırı Önleme Sistemleri (IPS - Intrusion Prevention System)**; ağ paketlerinin içerisindeki veri yükünü (payload) bayt seviyesinde inceleyen **Derin Paket İncelemesi (Deep Packet Inspection - DPI)** teknolojisiyle ağın güvenlik bekçiliğini yürütür.

---

## §5.2.1. IDS ve IPS Karşılaştırması

```mermaid
flowchart TD
    subgraph InlineMode["IPS: Hat Üzeri (Inline) Konumlandırma"]
        In1["Gelen Trafik"] --> IPS["IPS Cihazı (Aktif Filtreleme)"]
        IPS -->|Temiz Trafik| Internal["İç Ağ / Sunucular"]
        IPS -.->|Zararlı Paket Engellenir (Drop)| Blocked["Engellenen Paket"]
    end
    subgraph OutOfBandMode["IDS: Bant Dışı (Out-of-Band) Konumlandırma"]
        Switch["Switch (SPAN / Mirroring)"] -->|Trafiğin Kopyası| IDS["IDS Sensörü (Pasif İzleme)"]
        Switch --> User["Kullanıcı"]
        IDS -.->|Alarm Üretir| SOC["SOC / SIEM Alarmı"]
    end
```

![IDS ve IPS Karşılaştırma Matrisi](./1_c_ZQKlfDV_isCps7fxyH8A.webp)

![IDS ve IPS Tespit Mimarileri](./1_IwTYwOqFbmnzoAnDVPl8DA.webp)

| Özellik | IDS (Saldırı Tespit Sistemi) | IPS (Saldırı Önleme Sistemi) |
| :--- | :--- | :--- |
| **Konumlandırma** | Bant dışı (Out-of-Band / Pasif / SPAN / TAP) | **Hat üzeri (Inline / In-Path / Aktif)** |
| **Gecikmeye Etkisi** | Sıfır gecikme (Trafiğin kopyasını inceler) | Mikrosaniye düzeyinde ek gecikme ekler |
| **Müdahale Yeteneği** | **Pasiftir.** Saldırıyı durduramaz; yalnızca alarm üretir veya TCP RST yollar. | **Aktiftir.** Zararlı paketi anında düşürür (Drop) ve oturumu keser. |
| **Yanlış Pozitif (False Positive) Riski** | Düşüktür (Sadece gereksiz alarm üretir, iş akışı kesilmez). | **Yüksektir.** Yanlış bir kural kritik iş trafiğini kesebilir. |

---

## §5.2.2. Tespit Metodolojileri: İmza, Anomali ve Davranış Analizi

![IDS/IPS Tespit Yöntemlerinin Karşılaştırmalı Analizi](./1_PjPS0Bfp8Mb94zqFwP74Dw.webp)

1. **İmza Tabanlı Tespit (Signature-Based):** Bilinen saldırı kalıplarını (CVE zafiyetleri, bilinen exploit shellcode'ları, zararlı yazılım hash'leri) içeren geniş bir kural kütüphanesine dayanır. Hızlıdır ve yanlış pozitif oranı düşüktür; ancak henüz bilinmeyen sıfırıncı gün (0-day) saldırılarını yakalayamaz.
2. **Anomali ve Davranış Tabanlı Tespit (Anomaly-Based):** Ağın normal çalışma profilini (Baseline) çıkarır. Normalin dışına çıkan ani trafik sıçramalarını, olağandışı port kullanımlarını ve bilinmeyen protokol davranışlarını tespit eder. Sıfırıncı gün saldırılarını yakalayabilir ancak yanlış pozitif üretme ihtimali daha yüksektir.
3. **Protokol Durum Analizi (Stateful Protocol Analysis):** Protokollerin RFC standartlarına uygunluğunu denetler (örneğin HTTP başlığında standart dışı uzunluk veya geçersiz bayrak kullanımı).

---

## §5.2.3. Açık Kaynak IDS/IPS Ekosistemi: Snort, Suricata ve Zeek

Kurumsal ortamlarda ve SOC merkezlerinde en yaygın kullanılan açık kaynak motorlar:

### 1. Snort (2.x / 3.x)
Cisco tarafından geliştirilen dünyanın en köklü imza tabanlı kural motorudur.

```text
# Örnek Snort/Suricata Kural Anatomisi
alert tcp $EXTERNAL_NET any -> $HTTP_SERVERS 80 (msg:"WEB-ATTACKS /etc/passwd path traversal attempt"; flow:to_server,established; content:"/etc/passwd"; nocase; sid:1000001; rev:1;)
```

### 2. Suricata
Çok çekirdekli (Multi-threaded) modern işlemci mimarilerine tam uyumlu, donanımsal hızlandırma ve yerleşik L7 protokol ayrıştırma (HTTP, DNS, TLS, SMB) yeteneklerine sahip yüksek hızlı bir IPS motorudur.

### 3. Zeek (Eski Adıyla Bro)
Geleneksel bir imza motorundan ziyade bir **ağ güvenlik analitiği ve telemetri platformudur**. Ağdaki tüm konuşmaları yapılandırılmış tablolara (conn.log, dns.log, http.log, ssl.log) dönüştürerek SIEM ve tehdit avcılığı için kusursuz veri sağlar.
