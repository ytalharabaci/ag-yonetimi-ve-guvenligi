---
title: Ayrıcalıklı Erişim Yönetimi (PAM), MFA ve Parolasız Doğrulama (FIDO2)
sidebar:
  order: 3
  label: "8.3  PAM, MFA ve Parolasız Doğrulama"
---

# Ayrıcalıklı Erişim Yönetimi (PAM), MFA ve Parolasız Doğrulama (FIDO2)

Siber saldırılarda ihlal edilen hesapların büyük çoğunluğu zayıf, tekrar kullanılan veya oltalama (phishing) yoluyla çalınan parolalardan kaynaklanır. Özellikle sistem yöneticisi (root/admin) hesaplarının ele geçirilmesi kurumsal ağların tamamen fidye yazılımları (Ransomware) tarafından şifrelenmesiyle sonuçlanır.

Bu riskleri bertaraf etmek için iki kritik mimari benimsenmektedir: **Ayrıcalıklı Erişim Yönetimi (PAM)**, oltalama saldırılarına karşı tam korumalı **FIDO2 / Parolasız Doğrulama** ve **Hibrit Kimlik Güvenliği**.

---

## §8.3.1. Ayrıcalıklı Erişim Yönetimi (PAM) Mimarisi

PAM çözümleri (CyberArk, BeyondTrust, Delinea); kurumsal ağdaki en kritik hesapların (Domain Admin, veritabanı `sa`, Linux `root`, ağ cihazı `enable` parolaları) insan yöneticilerin hafızasında tutulmasını yasaklar:

```mermaid
flowchart LR
    Admin["Sistem Yöneticisi"] -->|1. Web Arayüzünden Oturum Talep Eder| PAM["PAM Kasası (Jump Server / Vault)"]
    PAM -->|2. MFA Doğrulaması & Bilet Onayı| Approval["Yönetici Onayı"]
    Approval -->|3. Parolayı Göstermeden İzole Oturum Açar| Target["Kritik Sunucu / Router"]
    PAM -.->|4. Tüm RDP/SSH Oturumunu Video Olarak Kaydeder| Storage["Denetim Arşivi"]
```

### Temel PAM Yetenekleri:
1. **Parola Kasası ve Otomatik Döndürme (Credential Rotation):** Yöneticiler sunucuların gerçek şifresini bilmez. PAM kasası her oturum sonrasında şifreyi 30 karakterlik rastgele bir metinle otomatik değiştirir.
2. **Just-in-Time (JIT) Erişim:** Yöneticilere sürekli (standing) admin yetkisi verilmez; yalnızca acil müdahale süresince (örneğin 2 saatliğine) geçici yetki tanımlanır.
3. **Oturum İzolasyonu ve Kaydı:** Yönetici hedef sunucuya doğrudan bağlanamaz; aradaki izole bir Jump Server üzerinden bağlanır. Tüm tuş basımları (keystrokes) ve ekran görüntüleri adli denetim için video olarak kaydedilir.

---

## §8.3.2. Çok Faktörlü Doğrulama (MFA) ve Oltalama Zafiyetleri

MFA, kimlik doğrulamada bilinen üç temel faktörün en az ikisinin birleşimini zorunlu kılar:
- **Bildiğin bir şey:** Parola, PIN
- **Sahip olduğun bir şey:** Akıllı telefon (TOTP), donanımsal güvenlik anahtarı (YubiKey)
- **Olduğun bir şey:** Parmak izi, yüz tanıma

### Klasik MFA'nın Zafiyeti ve MFA Yorgunluğu (MFA Fatigue):
SMS ve e-posta tabanlı MFA'lar SIM-Swap ve ortadaki adam (MitM / Evilginx) saldırılarıyla kolayca çalınabilir. Saldırgan gece yarısı yöneticinin telefonuna yüzlerce bildirim yollayarak (**MFA Prompt Bombing**) kullanıcının uykulu bir anında "Onayla" butonuna basmasını sağlar.
- **Savunma:** Bildirim ekranında rastgele iki basamaklı sayı eşleştirme (**Number Matching**) zorunlu tutulmalıdır.

---

## §8.3.3. FIDO2 / WebAuthn ile Oltalama Karşıtı Gelecek

FIDO Alliance ve W3C standardı olan **FIDO2 / WebAuthn (Passkeys)**, şifreleri tamamen ortadan kaldıran ve oltalama saldırılarına karşı matematiksel olarak bağışık olan tek mimaridir.

```mermaid
sequenceDiagram
    autonumber
    actor User as Kullanıcı
    participant Key as Donanımsal Anahtar (YubiKey / TPM)
    participant Browser as Web Tarayıcısı (WebAuthn API)
    actor Server as Doğrulama Sunucusu (FIDO2 Server)

    Server->>Browser: 1. Challenge Üretir (Rastgele Veri)
    Browser->>Key: 2. Alan Adı (origin: ornek.com) + Challenge
    Note over Key: 3. Anahtar Yalnızca "ornek.com" için Özel Anahtarla İmzalar!
    Key-->>Browser: 4. Dijital İmza (Assertion Signature)
    Browser-->>Server: 5. İmzayı İletir
    Server-->>Browser: 6. Genel Anahtar ile Doğrulandı (Oturum Açıldı!)
```

### Neden Oltalama Yapılamaz?
Saldırgan sahte bir oltalama sitesi (`www.ornekk-banka.com`) kursa ve kullanıcı bu siteye girse dahi:
- Donanımsal FIDO2 anahtarı veya Windows Hello TPM yongası, imzalamayı tarayıcının adres çubuğundaki **Origin (Alan Adı)** bilgisine göre yapar.
- Sahte domain için geçerli bir özel anahtar bulunamayacağından imzalama işlemi gerçekleşmez; saldırgan hiçbir veri elde edemez.

---

## §8.3.4. Hibrit Kimlik Güvenliği ve Active Directory Kurtarma

![Hibrit Kimlik Altyapılarının Güvenliği: Azure AD Connect](./1_m6kPdehFatPSmDwBEF0fDw.webp)

![Active Directory Olay Müdahale ve Felaket Kurtarma](./1_LthF_GXjUk5o1DenNl0tAw.webp)

Kurumlar şirket içi Active Directory'yi Microsoft Entra ID (Azure AD) ile senkronize ederken hibrit saldırı yüzeyi genişler:
1. **Azure AD Connect Sunucusunun İzolasyonu:** Bu sunucu Tier 0 varlığı kabul edilmeli ve yalnızca yerel yetkili yönetim istasyonlarından yönetilmelidir.
2. **Password Hash Sync (PHS) vs Pass-Through Authentication (PTA):** Şirket içi ortam ihlal edildiğinde bulut hesaplarının ele geçirilmesini önlemek için koşullu erişim (Conditional Access) kuralları uygulanmalıdır.
3. **Active Directory Ormanı Felaket Kurtarma (AD Forest Recovery):** Fidye yazılımı saldırısında tüm DC'ler şifrelendiğinde, temiz ve çevrimdışı (Air-Gapped / Immutable) yedekten hızlı geri dönüş prosedürleri önceden tatbik edilmelidir.
