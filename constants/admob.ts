import { Platform } from 'react-native';

// PRODUCTION_MODE は App Store 審査通過後に true に変更
const PRODUCTION_MODE = false;

export const AD_UNIT_IDS = {
  banner: {
    ios: PRODUCTION_MODE
      ? 'REPLACE_WITH_PRODUCTION_BANNER_IOS'
      : 'ca-app-pub-3940256099942544/2934735716',
    android: PRODUCTION_MODE
      ? 'REPLACE_WITH_PRODUCTION_BANNER_ANDROID'
      : 'ca-app-pub-3940256099942544/6300978111',
  },
  rewarded: {
    ios: PRODUCTION_MODE
      ? 'REPLACE_WITH_PRODUCTION_REWARDED_IOS'
      : 'ca-app-pub-3940256099942544/1712485313',
    android: PRODUCTION_MODE
      ? 'REPLACE_WITH_PRODUCTION_REWARDED_ANDROID'
      : 'ca-app-pub-3940256099942544/5224354917',
  },
  interstitial: {
    ios: PRODUCTION_MODE
      ? 'REPLACE_WITH_PRODUCTION_INTERSTITIAL_IOS'
      : 'ca-app-pub-3940256099942544/4411468910',
    android: PRODUCTION_MODE
      ? 'REPLACE_WITH_PRODUCTION_INTERSTITIAL_ANDROID'
      : 'ca-app-pub-3940256099942544/1033173712',
  },
};

export function getBannerAdUnitId(): string {
  return Platform.OS === 'ios'
    ? AD_UNIT_IDS.banner.ios
    : AD_UNIT_IDS.banner.android;
}

export function getRewardedAdUnitId(): string {
  return Platform.OS === 'ios'
    ? AD_UNIT_IDS.rewarded.ios
    : AD_UNIT_IDS.rewarded.android;
}
