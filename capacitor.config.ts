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
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      splashFullScreen: false,
      splashImmersive: false
    }
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
