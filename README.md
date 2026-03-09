# Navi-Air Frontend

Bu proje, Navi-Air uygulamasının kullanıcı arayüzünü içerir. Lokasyonların, ulaşımların yönetilmesi ve bu lokasyonlar arasında rota bulunması gibi işlevsellikler sunar. Proje, kimlik doğrulama, rol bazlı erişim kontrolü ve çoklu dil (Türkçe/İngilizce) desteği gibi modern web uygulama özelliklerini barındırır.

## Kullanılan Teknolojiler

- **Frontend:** React, TypeScript, Vite
- **Routing:** React Router
- **API İletişimi:** Axios
- **Harita:** Leaflet & OpenStreetMap
- **Uluslararasılaştırma (i18n):** react-i18next
- **Deployment:** Docker, Nginx

## Ön Gereksinimler

Projeyi sorunsuz bir şekilde ayağa kaldırabilmek için aşağıdaki araçların sisteminizde yüklü olması gerekmektedir.

| Teknoloji          | Önerilen Sürüm | Kontrol Komutu           |
| ------------------ | -------------- | ------------------------ |
| **Node.js**        | `24.x`         | `node -v`                |
| **npm**            | `10.x`         | `npm -v`                 |
| **Docker**         | `20.10+`       | `docker --version`       |
| **Docker Compose** | `v2+`          | `docker compose version` |

### Backend Projesi

Bu frontend projesinin çalışabilmesi için backend projesinin de hazır olması gerekmektedir.

- Backend projesinin (`aviation-case-study`) bu projeyle aynı dizin seviyesinde (yan yana klasörlerde) bulunması gerekmektedir.

## Projeyi Çalıştırma

Bu proje, backend ve diğer bağımlılıkları (veritabanı, Redis) ile birlikte tek bir komutla ayağa kaldırılacak şekilde tasarlanmıştır.

### Gerekli Dosya Yapısı

Projeyi çalıştırmadan önce, klasör yapınızın aşağıdaki gibi olduğundan emin olun:

```
/calisma_dizini/
  ├── navi-air/             # Bu frontend projesi
  └── aviation-case-study/  # Backend projesi
```

### Çalıştırma Adımları

1.  Terminali açın ve `navi-air` (bu proje) klasörünün içine girin.
2.  Aşağıdaki komutu çalıştırın:
    ```bash
    docker-compose up --build
    ```

Bu komut, tüm servisleri (Frontend, Backend, PostgreSQL, Redis) derleyecek ve ayağa kaldıracaktır.

- **Frontend:** `http://localhost:5665`
- **Backend API:** `http://localhost:8899`

> **Not:** Frontend'in düzgün çalışabilmesi için backend uygulamasının ayakta olması zorunludur. `docker-compose` bu bağımlılığı otomatik olarak yönetir.

## Lokal Geliştirme Ortamı

Eğer projeyi Docker olmadan, sadece lokalde geliştirmek isterseniz:

1.  Backend projesini kendi ortamında çalıştırın (genellikle `http://localhost:8899` adresinde).
2.  Bu projenin (`navi-air`) kök dizininde aşağıdaki komutları çalıştırın:

    ```bash
    # Bağımlılıkları yükle
    npm install

    # Geliştirme sunucusunu başlat
    npm run dev
    ```

3.  Uygulama varsayılan olarak `http://localhost:5665` adresinde çalışacaktır.
