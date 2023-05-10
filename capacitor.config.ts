import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'klasszone',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  Splashscreen: {
    launchAutoHide : true,
    launchShowDuration : 0
  },
  cordova : {
    preferences : {
      LottieFullScreen : "true",
      LottieHideAfterAnimationEnd : "true",
      LottieAnimationLocation: "public/assets/splash.json"
    }
  }
};

export default config;
