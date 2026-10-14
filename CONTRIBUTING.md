# 🤝 Katkıda Bulunma Rehberi

Bu projeye katkıda bulunmak istediğiniz için teşekkür ederiz! **Ağ Yönetimi ve Güvenliği** web kitabı, tamamen açık kaynaklı bir topluluk projesidir. Türkiye'deki Türkçe teknik ağ mühendisliği ve derin paket analizi (DFIR) kaynak açığını kapatmak amacıyla geliştirilen bu başucu kaynağını hep birlikte daha da ileriye taşıyabiliriz.

Aşağıda, projeye nasıl katkı sağlayabileceğinize dair adım adım yönergeler yer almaktadır.

---

## 🚀 Hızlı Katkı (Web Üzerinden)

Küçük imla hataları, harf düzeltmeleri veya ufak düzenlemeler için bilgisayarınıza hiçbir geliştirme ortamı kurmanıza gerek yoktur:

1. Web kitabında okumakta olduğunuz herhangi bir sayfanın en altına gidin.
2. **"Sayfayı düzenle"** (*Edit this page*) bağlantısına tıklayın.
3. Bu bağlantı sizi doğrudan GitHub üzerindeki ilgili markdown (.md) dosyasına yönlendirecektir.
4. Düzenleme kalem simgesine tıklayarak değişikliklerinizi yapın ve doğrudan tarayıcı üzerinden bir **Pull Request (PR)** oluşturun.

---

## 💻 Gelişmiş Katkı (Yerel Ortamda)

Rehbere yeni protokol analizleri eklemek, Wireshark filtreleri zenginleştirmek veya yapısal iyileştirmeler yapmak için yerel ortamınızı kurabilirsiniz:

### 1. Fork & Klonlama
1. GitHub deposunun sağ üst köşesindeki **"Fork"** butonuna tıklayarak projeyi kendi hesabınıza kopyalayın.
2. Kendi çatalınızı (fork) bilgisayarınıza klonlayın:
   ```bash
   git clone https://github.com/[KULLANICI-ADINIZ]/ag-yonetimi-ve-guvenligi.git
   cd ag-yonetimi-ve-guvenligi
   ```

### 2. Geliştirme Ortamı
1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. Yerel geliştirme sunucusunu çalıştırın:
   ```bash
   npm run dev
   ```
3. Tarayıcınızda `http://localhost:4321/ag-yonetimi-ve-guvenligi/` adresini açarak yaptığınız değişiklikleri anlık (*hot-reload*) olarak gözlemleyin.

### 3. Değişiklikleri Yapma
1. Değişiklikleriniz için anlamlı bir isme sahip yeni bir branch oluşturun:
   ```bash
   git checkout -b ozellik/bolum-X-iyilestirme
   ```
2. `src/content/docs/` dizini altındaki ilgili markdown (.md) dosyalarını düzenleyin veya yeni dosyalar ekleyin.

### 4. Yerel Derleme Testi
Pull Request açmadan önce projenin sorunsuz derlendiğinden emin olun:
```bash
npm run build
```
Bu komut, tüm sayfaların, görsel optimizasyonlarının ve arama indeksinin (Pagefind) hatasız oluşturulduğunu teyit eder.

### 5. Commit & Push
1. Değişikliklerinizi ekleyin ve commit mesajınızı yazın (*Conventional Commits* standardını öneririz):
   ```bash
   git add .
   git commit -m "docs(l4): add TCP window scaling analysis"
   git push origin ozellik/bolum-X-iyilestirme
   ```
2. GitHub üzerinden ana depoya yönelik bir **Pull Request** açın.

---

## 📜 Yazım ve Biçimlendirme Kuralları

* **Teknik Derinlik:** Teori anlatılırken mutlaka protokol başlık yapısı, RFC standardı, Wireshark filtreleri veya komut satırı konfigürasyonları eklenmelidir.
* **Mermaid Diyagramları:** Akışlar ve el sıkışmalar Mermaid ile görselleştirilmeli, bağlantı metinlerinde parantez varsa tırnak içine alınmalıdır (`-->|"Etiket (Bilgi)"|`).
* **Uyarı Kutuları (Asides):** Starlight yerel asides formatı kullanılmalıdır (`:::note`, `:::tip`, `:::caution[Başlık]`, `:::danger`).
* **Kaynak Gösterme:** Kullanılan dış kaynaklar ve standartlar sayfa sonunda açıkça referans verilmelidir.

Katkılarınız için şimdiden teşekkür ederiz!

