# Coolify Deployment Guide

## Ön Gereksinimler

- Node.js 18+ 
- npm 8+

## Coolify'da Deployment

### 1. Repository Ayarları
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: `3000`

### 2. Environment Variables
Aşağıdaki environment variable'ları Coolify'da ayarlayın:

```
NODE_ENV=production
PORT=3000
```

### 3. Build Ayarları
- **Node Version**: 18.x
- **Install Command**: `npm ci --only=production`
- **Build Command**: `npm run build`

### 4. Domain Ayarları
- **Domain**: `deneme.karadenizdis.com`
- **SSL**: Otomatik SSL sertifikası

### 5. Deployment Notları

#### API URL'leri
Tüm API çağrıları `https://webapi.karadenizdis.com/api/` adresine yönlendirilmiştir.

#### Image Domains
Next.js konfigürasyonunda aşağıdaki domain'ler izin verilmiştir:
- `localhost` (development)
- `webapi.karadenizdis.com` (production)

#### Build Optimizasyonları
- Standalone output kullanılıyor
- CSS optimizasyonu aktif
- Package imports optimize edilmiş

### 6. Troubleshooting

#### Build Hatası
Eğer build sırasında hata alırsanız:
1. Node.js versiyonunu 18+ olduğundan emin olun
2. `npm ci` komutunu manuel olarak çalıştırın
3. Build loglarını kontrol edin

#### Runtime Hatası
Eğer uygulama çalışmıyorsa:
1. Port ayarlarını kontrol edin
2. Environment variable'ları doğru ayarlandığından emin olun
3. Log dosyalarını kontrol edin

### 7. Monitoring
- PM2 ile process monitoring
- Log dosyaları: `./logs/`
- Memory limit: 1GB
- Auto restart aktif

### 8. SSL/HTTPS
Coolify otomatik olarak SSL sertifikası sağlayacaktır. Domain ayarlarında SSL'i aktif edin.

## Local Development

```bash
# Dependencies yükle
npm install

# Development server başlat
npm run dev

# Production build
npm run build

# Production server başlat
npm start
``` 