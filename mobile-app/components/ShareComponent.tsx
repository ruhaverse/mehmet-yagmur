import React from 'react';
import { Share, Alert } from 'react-native';

interface ShareData {
  message?: string;
  url?: string;
  title?: string;
}

export const shareContent = async (data: ShareData) => {
  try {
    const shareOptions = {
      message: data.message || 'MehmetYagmur uygulamasından paylaşıldı!',
      url: data.url,
      title: data.title || 'MehmetYagmur',
    };

    const result = await Share.share(shareOptions);

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Paylaşıldı:', result.activityType);
      } else {
        console.log('Paylaşıldı');
      }
      return { success: true, action: 'shared' };
    } else if (result.action === Share.dismissedAction) {
      console.log('Paylaşım iptal edildi');
      return { success: false, action: 'dismissed' };
    }
  } catch (error) {
    console.error('Paylaşım hatası:', error);
    Alert.alert('Hata', 'Paylaşım sırasında bir hata oluştu');
    return { success: false, error: error instanceof Error ? error.message : 'Bilinmeyen hata' };
  }
};

// Post paylaşımı için özel fonksiyon
export const sharePost = async (postId: string, postText: string) => {
  const shareData = {
    message: `${postText}\n\nMehmetYagmur uygulamasından paylaşıldı`,
    url: `https://mehmetyagmur.app/post/${postId}`, // Deep link
    title: 'MehmetYagmur - Gönderi Paylaşımı',
  };

  return await shareContent(shareData);
};

// Profil paylaşımı için özel fonksiyon
export const shareProfile = async (userId: string, username: string) => {
  const shareData = {
    message: `${username} adlı kullanıcının profilini inceleyin!`,
    url: `https://mehmetyagmur.app/profile/${userId}`,
    title: 'MehmetYagmur - Profil Paylaşımı',
  };

  return await shareContent(shareData);
};

// Uygulama paylaşımı için özel fonksiyon
export const shareApp = async () => {
  const shareData = {
    message: 'MehmetYagmur uygulamasını indir ve sen de katıl!\n\n🔗 App Store: https://apps.apple.com/mehmetyagmur\n🔗 Google Play: https://play.google.com/mehmetyagmur',
    title: 'MehmetYagmur - Sosyal Medya Uygulaması',
  };

  return await shareContent(shareData);
};

export default {
  shareContent,
  sharePost,
  shareProfile,
  shareApp,
};