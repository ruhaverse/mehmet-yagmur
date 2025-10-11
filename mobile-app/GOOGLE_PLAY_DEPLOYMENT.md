# Google Play Store Deployment Rehberi

## ✅ Proje Durumu
- ✅ React Native 0.72.17 kurulu
- ✅ TypeScript konfigürasyonu tamamlandı
- ✅ Metro bundler çalışıyor
- ✅ Tüm bağımlılıklar yüklendi
- ✅ Ekranlar düzgün çalışıyor

## 🔧 Yapılandırma Bilgileri
- **Uygulama Adı**: ShareUpTime
- **Package Name**: com.shareuptime
- **Version**: 1.0.0
- **Target SDK**: 34
- **Min SDK**: 21

## 📱 Google Play Store İçin Gereksinimler

### 1. App Bundle Oluşturma
```bash
cd android
./gradlew bundleRelease
```

### 2. Keystore Oluşturma
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore shareuptime-upload-key.keystore -alias shareuptime-upload -keyalg RSA -keysize 2048 -validity 10000
```

### 3. Gradle Yapılandırması
Android/app/build.gradle dosyasında:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('shareuptime-upload-key.keystore')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'shareuptime-upload'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }
    }
}
```

### 4. Uygulama Detayları
**İkon**: 512x512 ve çeşitli boyutlarda
**Ekran Görüntüleri**: Telefon ve tablet için
**Açıklama**: Türkçe/İngilizce
**Kategori**: Social/Lifestyle

### 5. Play Store Console Adımları
1. [Google Play Console](https://play.google.com/console) hesabı oluştur
2. Yeni uygulama oluştur
3. App Bundle yükle
4. Store listing bilgilerini doldur
5. Content rating al
6. Pricing & distribution ayarla
7. Release için review'a gönder

## 🚀 Deployment Komutları

### Metro Bundler Başlatma
```bash
npm start
```

### Android Build
```bash
npm run android
```

### Release Build
```bash
npm run build:android-bundle
```

## ⚠️ Önemli Notlar
- Android SDK 34 gerekli
- Java 11+ gerekli
- Gradle 8.0+ gerekli
- Play Store'da 64-bit APK zorunlu
- App Bundle önerilen format

## 📞 Destek
Herhangi bir sorun durumunda React Native belgelerine başvurun:
https://reactnative.dev/docs/signed-apk-android