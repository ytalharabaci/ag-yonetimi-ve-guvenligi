# 🌐 Ağ Yönetimi, Güvenliği ve Paket Analizi

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Turkish](https://img.shields.io/badge/Language-Turkish-red.svg)](#)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-WELCOME-brightgreen.svg?style=for-the-badge)](#-katkıda-bulunma)
[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)
[![Astro 7](https://img.shields.io/badge/Astro-7.3-orange.svg)](https://astro.build)

> **🎯 Kurumsal ağ altyapı mimarisinden derin paket incelemesine, DoS/DDoS ve gizli tünel analizinden NetDevOps ve SOC/NOC operasyonlarına kadar uzanan kapsamlı ve tamamen Türkçe teknik başucu rehberi.**

---

## 📖 Proje Hakkında

Bu **açık kaynaklı** teknik web kitabı, kurumsal ağ altyapılarını tasarlayan, yöneten ve koruyan sistem/ağ mimarları, güvenlik mühendisleri, SOC/Blue Team analistleri ve ağ adli bilişim (DFIR) uzmanları için hazırlanmıştır.

Klasik ağ dokümantasyonlarından farklı olarak bu çalışma, **kuramsal mimariyi doğrudan canlı paket düzeyindeki pratikle** birleştirir. Bir yönlendirme veya anahtarlama protokolü anlatılırken yalnızca teorisiyle kalmaz; **Wireshark PCAP incelemeleri, paket başlık anatomileri, saldırı vektörleri (SYN Flood, ARP Spoofing, DNS Tünelleme, C2 haberleşmesi) ve filtreleme yöntemleri** adım adım sunulur.

* **💻 Altyapı:** Astro 7 & Starlight (Modern ve Hızlı Web Arayüzü, Content Layer API)
* **🌍 Dil:** %100 Türkçe
* **🔍 Arama:** Pagefind ile tam entegre, anlık yerel arama desteği
* **🤝 Katkı:** Herkese açık ve Pull Request odaklı topluluk projesi

---

## 📑 Müfredat ve İçindekiler

Rehber, savunma derinliği (*defense-in-depth*) mantığıyla ilerleyen **12 ana bölüm** ve **39 alt bölümden** oluşur:

| Bölüm | Konu / Kapsanan Temel Başlıklar | Durum |
| :--- | :--- | :---: |
| **01. Ağ Mimarileri ve Trafik Akışı** | • Ağ Sınıflandırması (PAN/LAN/MAN/WAN), Topolojiler ve Spine-Leaf Omurga Mimarisi<br>• OSI Referans Modeli ve TCP/IP Protokol Yığını Karşılaştırması<br>• Wireshark Temelleri ve İstemci-Sunucu Trafik Akış Analizi | ✅ Yayında |
| **02. Bağlantı ve Ağ Katmanı (L2/L3)** | • ARP Protokol Mimarisi, Paket Anatomisi ve ARP Cache Yönetimi<br>• IPv4 ve IPv6 Adresleme, Alt Ağ Yönetimi, Başlık Alanları ve Parçalanma (MTU)<br>• ICMPv4/ICMPv6 Tanılama Araçları (Ping/Traceroute) ve Hata Analizi<br>• L2 Anahtarlama, VLAN, IEEE 802.1Q Trunking ve STP Döngü Önleme | ✅ Yayında |
| **03. Taşıma Katmanı (TCP/UDP) Analizi** | • TCP Protokol Anatomisi, 3 Yönlü El Sıkışma, ISN ve Bayraklar (SYN/ACK/FIN/RST/PSH)<br>• Wireshark ile TCP Performans ve Hata Analizi (Retransmission, Zero Window, RTO)<br>• UDP Protokolü ve Bağlantısız Akış Analitiği | ✅ Yayında |
| **04. Uygulama Katmanı Protokolleri (L7)** | • DNS Protokolü, İsim Çözümleme Hiyerarşisi, Kayıt Türleri ve Hata Kodları<br>• HTTP Protokolü, İstek/Yanıt Başlıkları ve Wireshark ile Nesne Dışa Aktarma<br>• HTTPS, TLS 1.2/1.3 El Sıkışması, SNI Alanı ve SSLKEYLOGFILE ile Şifre Çözümü<br>• FTP/FTPS/SFTP Protokolleri ve SMTP E-Posta Güvenliği (SPF, DKIM, DMARC) | ✅ Yayında |
| **05. Ağ Savunma Teknolojileri ve Mimarisi** | • Stateful vs. NGFW Güvenlik Duvarları, App-ID, User-ID ve DPI İncelemesi<br>• IDS/IPS Sistemleri (Snort, Suricata, Zeek) ve İmza/Davranış Tabanlı Tespit<br>• DMZ Tasarımı, Ağ Segmentasyonu ve Sıfır Güven (ZTNA / SASE) Mimarisi<br>• Güvenli Uzaktan Erişim (IPsec/WireGuard VPN) ve WPA3-Enterprise (802.1X/EAP-TLS) | ✅ Yayında |
| **06. Ağ Saldırıları, DoS/DDoS ve Paket Tespiti** | • Katman 2 Saldırıları (Macof CAM Tablosu Taşması, ARP Zehirlenmesi, DHCP Starvation)<br>• Taşıma Katmanı Hizmet Engelleme Saldırıları (SYN/RST/UDP Flood Tespiti)<br>• Ağ ve Uygulama Katmanı DoS/DDoS Saldırıları (ICMP Smurf, Slowloris, HTTP Flood)<br>• DNS Amplification Saldırıları, Anycast DNS ve Yansıtma Koruması | ✅ Yayında |
| **07. Gizli Kanallar (C2) ve Tehdit Avcılığı** | • DNS Tünelleme (dnscat2, iodined) ve Subdomain Entropi Analizi<br>• ICMP ve HTTP/HTTPS Gizli Tünelleri (ptunnel, Beaconing, Jitter Tespiti)<br>• Wireshark Tehdit Avı (Threat Hunting) Filtre Kütüphanesi | ✅ Yayında |
| **08. Kimlik ve Active Directory Güvenliği** | • Ağ Erişim Denetimi (NAC), IEEE 802.1X ve AAA Mimarisi (RADIUS vs. TACACS+)<br>• Active Directory, Kerberos v5 Bilet Mekanizması ve NTLM Protokol Güvenliği<br>• Ayrıcalıklı Erişim Yönetimi (PAM), Golden/Silver Ticket Tespiti ve FIDO2 / Passkeys | ✅ Yayında |
| **09. Ağ Yönetimi, İzleme ve Telemetri** | • Ağ Yönetiminin Temel Çerçevesi: ISO FCAPS Modeli<br>• SNMPv1/v2c vs. SNMPv3 USM/VACM Mimarisi ve MIB/OID Ağacı İzleme<br>• Trafik Akış Analitiği (NetFlow v5/v9, sFlow, IPFIX) ve Konuşmacı Tespiti<br>• RFC 5424 Syslog Standardı ve 5651 Sayılı Kanun Zaman Damgası Uyumluluğu | ✅ Yayında |
| **10. Ağ Otomasyonu ve NetDevOps** | • Kod Olarak Altyapı (IaC), NetDevOps İlkeleri ve NetBox SSoT Entegrasyonu<br>• Modern Yönetim Protokolleri: NETCONF, RESTCONF ve YANG Veri Modelleri<br>• Python (Netmiko) ve Ansible ile Çok Cihazlı Ağ Konfigürasyon Orkestrasyonu | ✅ Yayında |
| **11. Bulut Ağları ve Hibrit Altyapı Güvenliği** | • Sanal Veri Merkezi Mimarisi: AWS VPC / Azure VNet, Alt Ağlar ve Sanal Yönlendiriciler<br>• Bulut Trafik Filtreleme: Security Groups (SG) vs. Network ACLs (NACL)<br>• Hibrit Ağ Bağlantıları (Transit Gateway, DirectConnect) ve CSPM / CASB Duruşu | ✅ Yayında |
| **12. SOC/NOC Operasyonları ve Ağ Adli Bilişimi** | • SOC ve NOC İş Birliği: Entegre ISOC Mimarisi ve Alarm Triyajı<br>• Açık Kaynak Güvenlik Ekosistemi (Wazuh, Zeek, Suricata, Prometheus/Grafana)<br>• NIST/SANS Ağ Olaylarına Müdahale ve Delil Zinciri (Chain of Custody - DFIR) | ✅ Yayında |

---

## 🚀 Hızlı Başlangıç (Yerel Geliştirme)

Bu projeyi bilgisayarınızda çalıştırmak ve anlık değişiklikleri görüntülemek için aşağıdaki adımları izleyebilirsiniz.

### 📋 Gereksinimler
* [Node.js](https://nodejs.org/) (v22.12.0 veya üzeri)
* npm (Node.js ile otomatik olarak yüklenir)

### ⚡ Kurulum ve Çalıştırma
```bash
# 1. Projeyi klonlayın
git clone https://github.com/yusufarbc/ag-yonetimi-ve-guvenligi.git
cd ag-yonetimi-ve-guvenligi

# 2. Bağımlılıkları yükleyin
npm install

# 3. Yerel geliştirme sunucusunu başlatın
npm run dev
```

Ardından tarayıcınızda `http://localhost:4321/ag-yonetimi-ve-guvenligi/` adresine giderek kitabı anlık (*hot-reload*) olarak görüntüleyebilirsiniz.

### 🏗️ Canlıya Derleme (Production Build)
```bash
npm run build
```
Oluşturulan statik web sitesi `dist/` klasörüne derlenir ve GitHub Actions ile GitHub Pages üzerinde otomatik olarak yayınlanır.

---

## 🤝 Katkıda Bulunma

Bu rehberin gelişmesi ve güncel kalması ağ ve güvenlik topluluğunun katkılarına bağlıdır. Her türlü katkı (imla düzeltmeleri, yeni protokol analizleri, PCAP örnekleri, Wireshark filtreleri vb.) son derece değerlidir.

* **💡 Hızlı Katkı:** Okuduğunuz herhangi bir sayfanın en altında bulunan **"Sayfayı düzenle"** (*Edit this page*) butonuna tıklayarak doğrudan tarayıcı üzerinden Pull Request gönderebilirsiniz.
* **📂 Detaylı Katkı Süreci:** Detaylı katkı yönergeleri ve commit standartları için lütfen **[Katkı Rehberi (CONTRIBUTING.md)](CONTRIBUTING.md)** dosyasını inceleyin.
* **🎨 Yazım Standartları:** Mermaid diyagramı ekleme ve Starlight Asides kullanımı için **[Kullanım Kılavuzu (KULLANIM.md)](KULLANIM.md)** dosyasını inceleyin.

---

## 📊 Proje İstatistikleri

* **🏗️ Yapı:** 12 Bölüm, 39 Alt Bölüm (Teknik Markdown Dokümanları)
* **🖼️ Görseller:** 185 adet optimize edilmiş teknik diyagram, mimari şema ve PCAP yakalama görüntüsü
* **🔍 Arama Motoru:** Pagefind ile tam entegre, anlık yerel arama desteği
* **🔧 CI/CD:** GitHub Actions ile otomatik derleme ve yayınlama

---

## 📜 Lisans

Bu proje **Creative Commons Attribution 4.0 International (CC BY 4.0)** lisansı altında korunmaktadır.
* ✅ **Serbest Kullanım:** Ticari kullanım, eğitim amaçlı kullanım, uyarlama ve yeniden dağıtım tamamen serbesttir.
* 📝 **Tek Koşul:** Orijinal esere atıfta bulunulması gerekmektedir.

```text
"Ağ Yönetimi, Güvenliği ve Paket Analizi" by Yusuf Talha ARABACI 
is licensed under CC BY 4.0
Kaynak: https://github.com/yusufarbc/ag-yonetimi-ve-guvenligi
```

---

## ✍️ Yazar ve İletişim

**Yusuf Talha ARABACI**
* 🐙 GitHub: [@yusufarbc](https://github.com/yusufarbc)
* 💼 LinkedIn: [yusufarbc](https://www.linkedin.com/in/yusufarbc/)

---

**🌟 Gelin, Türkiye'nin siber güvenlik ve ağ mühendisliği literatürünü birlikte büyütelim!**
