---
title: Merkezi Log Yönetimi, Syslog Standardı ve Yasal Uyumluluk (5651)
sidebar:
  order: 3
  label: "9.3  Syslog Standardı ve Yasal Loglama"
---

# Merkezi Log Yönetimi, Syslog Standardı ve Yasal Uyumluluk (5651)

Bir siber güvenlik olayında *"Ne zaman oldu, kim yaptı ve hangi sistemler etkilendi?"* sorularının yegane adli delil kaynağı log kayıtlarıdır. Ancak her cihazın logunu kendi yerel diskinde tutması durumunda; saldırgan sisteme sızdığında ilk iş olarak yerel logları siler (`eventvwr.msc` temizleme veya `/var/log` silme).

Bu nedenle kurumsal ağlarda tüm ağ donanımları, güvenlik duvarları ve sunucular olay anında loglarını anında merkezi bir **Syslog / SIEM** sunucusuna gönderecek şekilde yapılandırılır.

![İzleme ve Telemetri Platformları Özellik Matrisi](./1_8hiUXuINrhx_sc7cJlTO-A.webp)

---

## §9.3.1. RFC 5424 Syslog Standardı ve Ciddiyet Seviyeleri

Syslog mesajları iki temel parametreyle sınıflandırılır: **Facility (Kaynağın Türü)** ve **Severity (Olayın Ciddiyeti)**.

### Syslog Ciddiyet Seviyeleri (Severity Levels 0 - 7):

| Seviye | Adı | Anlamı ve Operasyonel Örnek |
| :---: | :--- | :--- |
| **0** | **Emergency** | Sistem tamamen çöktü, kullanılamaz durumda (Panik hali). |
| **1** | **Alert** | Acil müdahale gerektirir (Örn: Bozulmuş temel veritabanı). |
| **2** | **Critical** | Kritik donanım veya yazılım arızası (Yedekli güç kaynağı yandı). |
| **3** | **Error** | Hata durumu; bir servis veya işlem başarısız oldu. |
| **4** | **Warning** | Uyarı; hata değil ancak düzeltilmezse hataya yol açabilir. |
| **5** | **Notice** | Normal ancak dikkate değer olaylar (Arayüz Up/Down oldu). |
| **6** | **Informational** | Bilgilendirme mesajları (Normal kullanıcı girişi, ACL izni). |
| **7** | **Debug** | Geliştirici seviyesinde son derece detaylı tanılama kayıtları. |

---

## §9.3.2. Syslog Taşıma Güvenliği: UDP 514 vs TLS (TCP 6514)

- **Geleneksel Syslog (RFC 3164 - UDP 514):** Loglar ağ üzerinden açık metin ve UDP ile iletilir. Saldırgan paketleri dinleyerek sistem zafiyetlerini veya kullanıcı adlarını görebilir; ayrıca sahte log enjekte edebilir (Spoofing).
- **Güvenli Syslog (RFC 5425 - TCP 6514):** Loglar **TLS ile şifrelenir** ve TCP'nin güvenilir teslimat mekanizmasıyla iletilir. Ağda paket kaybı olsa bile logların kaybolması engellenir.

---

## §9.3.3. NTP (Zaman Senkronizasyonu) Olmadan Adli Bilişim Yapılamaz

Farklı sunucuların ve güvenlik duvarlarının saatleri arasında 30 saniyelik bir fark bile olsa, bir siber saldırı zincirini (Kill Chain) kronolojik olarak birleştirmek imkansız hale gelir.
- Tüm kurumsal ağ cihazları **NTP (Network Time Protocol - UDP 123)** ile stratum-1 veya kurumsal merkezi zaman sunucusuna kilitlenmelidir.
- Loglarda milisaniye veya mikrosaniye hassasiyetinde UTC zaman damgası (ISO 8601 - `2026-10-14T09:30:00.123Z`) kullanılmalıdır.

---

## §9.3.4. Türkiye Yasal Mevzuatı ve 5651 Sayılı Kanun Gereksinimleri

Türkiye'de faaliyet gösteren kurumlar, internet servis sağlayıcıları ve toplu kullanım sağlayıcılar (oteller, üniversiteler, şirketler) **5651 Sayılı Kanun** yükümlülüklerine tabidir:

1. **İç Hat Loglama (IP-MAC-Port Eşleştirmesi):** Kurum içi DHCP kira kayıtları, yerel IP adresi, MAC adresi ve NAT cihazındaki kaynak/hedef port eşleşmeleri en az **2 yıl** boyunca saklanmalıdır.
2. **Zaman Damgası (Timestamp) Zorunluluğu:** Log dosyaları günlük olarak **TÜBİTAK KamuSM** veya yetkili bir Zaman Damgası Sağlayıcısı tarafından **RFC 3161** standardına uygun olarak elektronik mühürle mühürlenmelidir.
3. **Değiştirilemezlik (Immutability / WORM):** Mühürlenen log dosyasında tek bir karakter dahi değiştirilirse hash değeri uyuşmayacağından mahkemelerde delil niteliğini kaybeder. Log depoları silinemez (WORM - Write Once Read Many) disklerde arşivlenmelidir.
