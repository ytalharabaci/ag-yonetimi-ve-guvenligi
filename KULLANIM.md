# 🚀 Kullanım Kılavuzu (Astro & Starlight)

Bu proje, modern bir dokümantasyon altyapısı olan **Astro 7 & Starlight 0.42** üzerine inşa edilmiştir. Ağ Yönetimi ve Güvenliği kitabının yazım sürecini kolaylaştırmak ve içeriği web üzerinden erişilebilir kılmak için aşağıdaki yönergeleri takip edebilirsiniz.

---

## 🛠️ Yerel Geliştirme Ortamı

Projeyi bilgisayarınızda çalıştırmak ve anlık değişiklikleri görmek için şu adımları izleyin:

### 1. Gereksinimler
- **Node.js**: v22.12.0 veya üzeri (Astro 7 gereksinimi)
- **Paket Yöneticisi**: npm (Node.js ile birlikte gelir)

### 2. Kurulum ve Çalıştırma
```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```
Sunucu başladığında, tarayıcınızda `http://localhost:4321/ag-yonetimi-ve-guvenligi/` adresine giderek kitabı görüntüleyebilirsiniz.

---

## 📂 Dosya Mimarisi ve Yazım Kuralları

Dokümanlar `src/content/docs/` klasörü altında hiyerarşik bir yapıda tutulur:

### 1. Klasör Yapısı
Her ana bölüm (Bölüm 01 - 12) kendi klasörüne sahiptir. Bu klasörlerin içinde alt başlıklar `.md` dosyaları olarak bulunur:
```text
src/content/docs/
├── 01-ag-mimarileri-ve-trafik-akisi/
├── 02-baglanti-ve-ag-katmani-protokolleri/
├── 03-tasima-katmani-tcp-ve-udp-analizi/
├── 04-uygulama-katmani-protokolleri/
├── ...
└── index.md
```

### 2. Yeni Dosya Ekleme ve Frontmatter
Yeni bir dosya eklerken şu Frontmatter yapısını kullanmalısınız:
```markdown
---
title: "§X.Y. Alt Bölüm Başlığı"
description: "Alt bölümün özeti ve teknik kapsamı."
---
```

### 3. Görsel ve Medya Yönetimi
*   **Görseller (WebP, PNG, SVG):** Görseller doğrudan ilgili alt bölüm klasörünün içine yerleştirilir veya `src/assets/images/` altına eklenir.
    *   *Kullanım:* `![Ağ Topolojisi](./Architecture-Figure13.webp)`
    *   Astro görsel optimizasyon motoru görselleri otomatik olarak optimize eder.

### 4. Mermaid ve Asides
*   **Mermaid Diyagramları:** ````mermaid ... ```` blokları içine yazılır.
*   **Uyarı Kutuları:** Starlight asides yapısı kullanılır:
    ```markdown
    :::tip[Analiz İpucu]
    tcp.analysis.retransmission filtresi ağdaki paket kayıplarını hızla gösterir.
    :::
    ```

---

## 🏗️ Canlıya Derleme (Build & Production)

```bash
npm run build
```
Derleme çıktısı `dist/` klasörüne aktarılır ve GitHub Actions aracılığıyla GitHub Pages üzerinde otomatik olarak yayınlanır.


## ✏️ Tarayıcıdan Düzenleme (Pages CMS)
Bölümler [Pages CMS](https://app.pagescms.org) ile tarayıcıdan da düzenlenebilir. Yapılandırma depo kökündeki `.pages.yml` dosyasındadır; her kayıt `main` dalına commit edilir ve GitHub Actions siteyi yeniden yayınlar.

1. `app.pagescms.org` adresinde GitHub hesabıyla giriş yapın ve Pages CMS GitHub App'ini bu depoya kurun (yalnızca bu depoyu seçin).
2. **Bölümler** koleksiyonunda klasörler bölümleri, dosyalar konuları gösterir. Gövde ham Markdown olarak düzenlenir; Mermaid, tablolar ve Starlight kutuları olduğu gibi kalır.
3. Görselleri **Medya** bölümünde ilgili bölüm klasörüne yükleyin ve gövdede `./gorsel.webp` biçiminde kullanın.
4. Yeni konuda dosya adını `NN-konu-adi.md` biçiminde verin ve `Sıra` / `Etiket` (ör. `1.5  Başlık`) alanlarını doldurun.

> Pages CMS yalnızca `.pages.yml` içinde tanımlı frontmatter alanlarını yazar (`title`, `sidebar.order`, `sidebar.label`). Yeni bir frontmatter alanı eklenirse `.pages.yml` dosyasına da eklenmelidir. `index.md` ve `404.md` CMS dışında tutulur.
