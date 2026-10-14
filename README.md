# 🌐 Ağ Yönetimi, Güvenliği ve Paket Analizi Web Kitabı

Bu proje; kurumsal ağ altyapı mimarisinden derin paket incelemesine, DoS/DDoS ve gizli tünel analizinden NetDevOps ve SOC/NOC operasyonlarına kadar uzanan kapsamlı bir **Türkçe teknik başucu kitabıdır**.

Modern dokümantasyon motoru **Astro 7** ve **Starlight 0.42** üzerine inşa edilmiş olup, zenginleştirilmiş Mermaid diyagramları, özel SOC/Blue Team teması, `§X.Y.Z` bölüm numaralandırma eklentisi ve Pagefind yerel arama motoruyla donatılmıştır.

---

## 📚 Kitap İçerik Yapısı (12 Ana Bölüm / 39 Alt Bölüm)

- **01. Ağ Mimarileri ve Trafik Akışı:** Ağ türleri (PAN/LAN/MAN/WAN), Spine-Leaf mimarisi, OSI ve TCP/IP modelleri, Wireshark ile İstemci-Sunucu trafik çözümleme senaryosu.
- **02. Bağlantı ve Ağ Katmanı (L2/L3):** ARP protokolü ve paket anatomisi, IPv4 ve IPv6 başlıkları, parçalanma (MTU), ICMP hata analizi, VLAN, Trunking (802.1Q) ve STP.
- **03. Taşıma Katmanı (TCP/UDP) Analizi:** TCP 3 yönlü el sıkışma, TCP bayrakları, yeniden iletimler (Retransmissions), Zero Window akış kontrolü ve UDP analitiği.
- **04. Uygulama Katmanı Protokolleri (L7):** DNS hiyerarşisi, DNS sorgu/yanıt anatomisi, NXDOMAIN ve SERVFAIL hataları, HTTP metodları, durum kodları, nesne dışa aktarma (Export Objects), TLS 1.3 el sıkışması, FTP/FTPS/SFTP ve SMTP e-posta güvenliği (SPF, DKIM, DMARC).
- **05. Ağ Savunma Teknolojileri ve Mimarisi:** Stateful vs NGFW (App-ID, User-ID), IDS/IPS sistemleri (Snort, Suricata, Zeek), DMZ tasarımı, Sıfır Güven (ZTNA), IPsec/WireGuard VPN ve WPA3-Enterprise (802.1X/EAP-TLS).
- **06. Ağ Saldırıları, DoS/DDoS ve Paket Tespiti:** L2 saldırıları (Macof CAM tablosu taşması, ARP Poisoning), TCP SYN/RST/ACK-PSH Flood, UDP Flood, ICMP Smurf, HTTP Slowloris ve DNS Amplification analizi.
- **07. Gizli Kanallar (C2) ve Tehdit Avcılığı:** DNS ve ICMP gizli tünelleri (iodine, dnscat2, ptunnel), HTTP/HTTPS Beaconing (Cobalt Strike, Sliver), Jitter analizi ve Wireshark Tehdit Avı filtre kütüphanesi.
- **08. Kimlik ve Active Directory Güvenliği:** AAA çerçevesi (RADIUS vs TACACS+), RBAC/ABAC modelleri, Active Directory ve Kerberos v5 bilet mekanizması, NTLM riskleri, Kerberoasting, PAM ve FIDO2 / Passkeys.
- **09. Ağ Yönetimi, İzleme ve Telemetri:** ISO FCAPS modeli, SNMPv3 USM/VACM mimarisi, Akış Analitiği (NetFlow v5/v9, IPFIX, sFlow) ve RFC 5424 Syslog / 5651 Sayılı Kanun zaman damgası uyumluluğu.
- **10. Ağ Otomasyonu ve NetDevOps:** Kod Olarak Altyapı (IaC), GitOps, NetBox SSoT, YANG veri modelleri, NETCONF XML-RPC, RESTCONF ve Python (Netmiko/Nornir) ile Ansible playbook'ları.
- **11. Bulut Ağları ve Hibrit Altyapı Güvenliği:** Paylaşılan Sorumluluk Modeli, vSwitch sanallaştırması, VPC/VNet alt ağ tasarımı, Güvenlik Grupları (SG) vs Network ACL (NACL), DirectConnect / Transit Gateway ve CSPM / CASB.
- **12. SOC/NOC Operasyonları ve Ağ Adli Bilişimi:** ISOC entegrasyonu, açık kaynak güvenlik stack'i (Wazuh SIEM/XDR, Elastic Stack, Suricata, Zeek, Arkime, TheHive), NIST SP 800-61 Olay Müdahale ve Delil Zinciri (Chain of Custody).

---

## 🛠️ Yerel Geliştirme ve Çalıştırma

### Gereksinimler:
- **Node.js:** v22.12.0+ (Astro 7 gereksinimi)
- **Paket Yöneticisi:** npm

### Geliştirme Sunucusunu Başlatma:
```bash
# Bağımlılıkları yükleyin
npm install

# Yerel geliştirme sunucusunu çalıştırın
npm run dev
```
Tarayıcınızda `http://localhost:4321/ag-yonetimi-ve-guvenligi/` adresini açarak kitabı anlık olarak okuyabilir ve düzenleyebilirsiniz.

### Canlıya Derleme (Build):
```bash
npm run build
```
Oluşturulan statik web sitesi `dist/` klasörüne derlenir ve GitHub Pages üzerinde otomatik olarak yayınlanır.

