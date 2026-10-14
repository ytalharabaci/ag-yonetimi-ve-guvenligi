---
title: Bulut Ağ Mimarisi, Sanallaştırma (vSwitch) ve Sanal Özel Bulut (VPC)
sidebar:
  order: 1
  label: "11.1  Bulut Ağ Mimarisi ve VPC Tasarımı"
---

# Bulut Ağ Mimarisi, Sanallaştırma (vSwitch) ve Sanal Özel Bulut (VPC)

Geleneksel veri merkezlerinde sunucular fiziksel kablolarla fiziksel switch portlarına bağlanırken; bulut bilişimde (AWS, Azure, Google Cloud) tüm ağ altyapısı yazılımla tanımlanmış sanal katmanlar (**Software-Defined Networking - SDN**) üzerinde çalışır.

Bir bulut mimarının fiziksel bir kabloya dokunmasına gerek yoktur; ancak sanal yönlendiricilerin, sanal anahtarların (vSwitch) ve alt ağların izolasyon kurallarını bilmek bulut ortamındaki verilerin güvenliği için hayati önem taşır.

---

## §11.1.1. Paylaşılan Sorumluluk Modeli (Shared Responsibility Model)

Bulut güvenliğinde en büyük yanılgı, tüm güvenliğin bulut sağlayıcısı (AWS/Azure) tarafından sağlandığı varsayımıdır.

```mermaid
flowchart TD
    subgraph Cust["MÜŞTERİNİN Sorumluluğu (Buluttaki Güvenlik)"]
        D1["Müşteri Verisi ve Şifreleme"]
        D2["Kimlik ve Erişim Yönetimi (IAM)"]
        D3["İşletim Sistemi Sıkılaştırma ve Yama Yönetimi"]
        D4["Ağ ve Güvenlik Duvarı Yapılandırması (Security Groups / NACLs)"]
    end
    subgraph CSP["BULUT SAĞLAYICISININ Sorumluluğu (Bulutun Güvenliği)"]
        P1["Fiziksel Veri Merkezleri ve Çevre Güvenliği"]
        P2["Fiziksel Sunucu Donanımları ve Kablolama"]
        P3["Hipervizör (KVM / Nitro / Hyper-V) İzolasyonu"]
    end
    Cust --- CSP
```

:::caution
Bulut sağlayıcısı fiziksel altyapıyı korurken; sanal ağınızın mimarisinden, portların açık kalmasından ve firewall kurallarından **tamamen kurumun kendisi sorumludur**.
:::
---

## §11.1.2. Sanallaştırma ve Sanal Anahtar (vSwitch) Mekaniği

Bir fiziksel sunucu (Hipervizör) üzerinde çalışan onlarca sanal makinenin (VM) haberleşmesi yazılımsal **vSwitch (Virtual Switch)** yapılarıyla sağlanır (VMware Distributed Switch, Linux Open vSwitch - OVS).

- **Sanal Ağ Kartı (vNIC):** Sanal makineye atanan sanal ağ arayüzüdür.
- **vSwitch İzolasyonu:** Sanal makineler arasındaki trafik fiziksel kabloya çıkmadan doğrudan hipervizörün RAM belleği üzerinden mikrosaniyeler içinde aktarılır.
- **Güvenlik Riskleri:** Fiziksel bir IDS/IPS cihazı iki sanal makine arasındaki bu Doğu-Batı trafiğini göremez. Bu kör noktayı aşmak için sanal hipervizör seviyesinde çalışan güvenlik eklentileri veya mikro-segmentasyon (VMware NSX) kullanılmalıdır.

---

## §11.1.3. Sanal Özel Bulut (VPC / VNet) Mimarisi

Bir bulut hesabında oluşturulan, tamamen izole edilmiş mantıksal veri merkezine **VPC (Virtual Private Cloud - AWS/GCP)** veya **VNet (Virtual Network - Azure)** denir.

```mermaid
flowchart TD
    subgraph VPC["Sanal Özel Bulut - VPC (10.0.0.0/16)"]
        IGW["İnternet Ağ Geçidi (Internet Gateway - IGW)"]
        subgraph PubSub["Genel Alt Ağ - Public Subnet (10.0.1.0/24)"]
            NAT["NAT Gateway"]
            ALB["Uygulama Yük Dengeleyici (ALB)"]
        end
        subgraph PrivSub["Özel Alt Ağ - Private Subnet (10.0.2.0/24)"]
            APP["Uygulama Sunucuları (EC2 / VM)"]
            DB[("Veritabanı (RDS Cluster)")]
        end
    end
    Internet["İnternet"] <==> IGW
    IGW <==> ALB
    ALB --> APP
    APP --> DB
    APP -->|Dışarıya Yama Çıkışı| NAT
    NAT --> IGW
```

### Kritik VPC Bileşenleri:
1. **Public Subnet (Genel Alt Ağ):** Yönlendirme tablosunda (Route Table) `0.0.0.0/0` hedefi doğrudan **Internet Gateway'e (IGW)** bağlı olan alt ağdır. Dış dünyadan doğrudan erişilebilen bileşenler (Yük dengeleyiciler, WAF, Bastion Host) bu alt ağda yer alır.
2. **Private Subnet (Özel Alt Ağ):** Doğrudan internete çıkışı ve dışarıdan girişi olmayan alt ağdır. Kritik kurumsal uygulamalar ve veritabanları burada tutulur.
3. **NAT Gateway:** Private alt ağdaki bir sunucunun internetten gelen saldırılara açık olmadan, yalnızca kendi işletim sistemi güncellemelerini indirebilmesi için dışarıya tek yönlü çıkış sağlayan yönetilen ağ geçididir.
