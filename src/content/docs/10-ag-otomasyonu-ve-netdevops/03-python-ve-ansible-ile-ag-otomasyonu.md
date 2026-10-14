---
title: Python, Bash ve Ansible ile Pratik Ağ Otomasyonu
sidebar:
  order: 3
  label: "10.3  Python ve Ansible ile Ağ Otomasyonu"
---

# Python, Bash ve Ansible ile Pratik Ağ Otomasyonu

Ağ otomasyonunda amaç, mühendislerin rutin ve tekrarlayan işlerini (yedek alma, VLAN açma, şifre değiştirme, port konfigürasyonu) kodla otomatize ederek insan hatasını sıfıra indirmek ve operasyon hızını saniyelere düşürmektir.

Bugün kurumsal ağ mühendisliğinde çoklu araç seti kullanılmaktadır: Hızlı ve hafif görevler için **Bash & PowerShell betikleri**, esneklik ve derin programlama için **Python ekosistemi**; bildirimsel (declarative) ve ajansız (agentless) orkestrasyon için **Ansible**.

---

## §10.3.1. Bash ve PowerShell ile Hızlı Ağ Yönetimi

Küçük ölçekli rutinler için tam teşekküllü bir otomasyon çatısı kurmaya gerek kalmadan işletim sistemi komut satırı araçları kullanılabilir:

### 1. Bash ve SSHPass ile Otomatik Cisco Yapılandırma Yedekleme

Aşağıdaki Bash betiği, bir Cisco anahtarına bağlanıp çalışan konfigürasyonu çeker ve zaman damgasıyla yerel arşive kaydeder:

```bash
#!/bin/bash
# ========================================================
# cisco_backup.sh - SSHPass ile Cisco IOS Yedekleme Betiği
# ========================================================

DEVICE_IP="192.168.1.1"
USERNAME="admin"
PASSWORD="GucluSifre!123"
BACKUP_DIR="/var/backups/cisco"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="${BACKUP_DIR}/switch_${DEVICE_IP}_${TIMESTAMP}.cfg"

mkdir -p "$BACKUP_DIR"

# Komutları çalıştır ve sayfalamayı terminal length 0 ile kapat
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "${USERNAME}@${DEVICE_IP}" << 'EOF' > "$OUTPUT_FILE"
terminal length 0
show running-config
exit
EOF

if [ $? -eq 0 ]; then
    echo "[+] Yedekleme başarıyla tamamlandı: $OUTPUT_FILE"
else
    echo "[-] Hata: Cihaza bağlanılamadı!" >&2
    exit 1
fi
```

### 2. PowerShell ile Windows Ağ Yönetimi

Sistem yöneticileri için PowerShell güçlü yerleşik ağ cmdlet'leri sunar:

```powershell
# 1. Yerel ağ adaptörlerini listeleme ve durumlarını inceleme
Get-NetAdapter | Select-Object Name, InterfaceDescription, Status, LinkSpeed

# 2. Belirli bir ağ adaptörünü devre dışı bırakma veya etkinleştirme
# Disable-NetAdapter -Name "Ethernet 2" -Confirm:$false
# Enable-NetAdapter -Name "Ethernet 2"

# 3. Birden fazla sunucuya port erişimini test etme (Test-NetConnection)
$Servers = @("192.168.1.10", "192.168.1.20", "10.0.0.5")
foreach ($srv in $Servers) {
    $res = Test-NetConnection -ComputerName $srv -Port 443
    Write-Host "$srv (Port 443): $(if ($res.TcpTestSucceeded) {'AÇIK'} else {'KAPALI'})"
}
```

---

## §10.3.2. Python Ağ Kütüphaneleri: Netmiko ile Çoklu Cihaz Yönetimi

Python ekosisteminde **Netmiko (Kirk Byers)**, 100'den fazla farklı ağ üreticisinin (Cisco, Juniper, Arista, Fortinet) sayfalama ve prompt mekanizmalarını otomatik yönetir:

```python
#!/usr/bin/env python3
"""
multi_device_provision.py - Netmiko ile Birden Fazla Cihaza Toplu VLAN Ekleme
"""
from netmiko import ConnectHandler

devices = [
    {
        'device_type': 'cisco_ios',
        'host': '192.168.1.11',
        'username': 'admin',
        'password': 'SecretPassword123',
    },
    {
        'device_type': 'cisco_ios',
        'host': '192.168.1.12',
        'username': 'admin',
        'password': 'SecretPassword123',
    }
]

config_commands = [
    'vlan 200',
    'name SOC_Izleme_VLAN',
    'exit',
    'interface range GigabitEthernet0/1 - 4',
    'switchport mode access',
    'switchport access vlan 200',
    'spanning-tree portfast'
]

for device in devices:
    print(f"[*] Bağlanılıyor: {device['host']}")
    try:
        with ConnectHandler(**device) as connection:
            connection.enable()
            output = connection.send_config_set(config_commands)
            connection.save_config()
            print(f"[+] Başarılı: {device['host']}\n{output}")
    except Exception as e:
        print(f"[-] {device['host']} üzerinde hata oluştu: {str(e)}")
```

---

## §10.3.3. Ansible ile Ajansız (Agentless) Ağ Orkestrasyonu

Ansible, yönetilen switch'lere yazılım yüklemeden doğrudan SSH üzerinden bildirimsel görevler yürütür:

```yaml
# cisco_vlan_provision.yml - Ansible ile Kurumsal VLAN Dağıtımı
---
- name: Kurumsal Çekirdek ve Dağıtım Anahtarları VLAN Yapılandırması
  hosts: core_switches
  gather_facts: no
  connection: network_cli

  tasks:
    - name: Kritik VLAN'ların Varlığını Doğrula ve Oluştur
      cisco.ios.ios_vlans:
        config:
          - vlan_id: 10
            name: Muhasebe
            state: active
          - vlan_id: 20
            name: Bilgi_Islem
            state: active
          - vlan_id: 30
            name: Sunucu_Ciftligi
            state: active
        state: merged

    - name: Yapılandırmayı NVRAM'e Kaydet (write memory)
      cisco.ios.ios_config:
        save_when: modified
```

---

## §10.3.4. Git ile Sürüm Denetimi ve Audit Trail

Alınan konfigürasyon yedekleri yerel sunucularda tutulmak yerine kurumsal bir özel **Git deposuna** (GitLab / GitHub) gönderilir:

- **Kim Ne Zaman Değiştirdi? (`git blame`):** Ağda bir sorun çıktığında dün gece hangi satırın, kim tarafından ve hangi bilet numarasıyla değiştirildiği tek tıkla görülür.
- **Fark Analizi (`git diff`):** Çalışan konfigürasyon ile dün geceki konfigürasyon arasındaki farklar satır satır incelenir.
- **Regülasyon Uyumluluğu:** ISO 27001 ve BDDK denetimlerinde konfigürasyon değişikliklerinin eksiksiz denetim izi (Audit Trail) sağlanmış olur.
