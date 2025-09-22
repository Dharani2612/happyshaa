import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f56dab60886940ffb20d73973b960af2',
  appName: 'Companion Care',
  webDir: 'dist',
  server: {
    url: 'https://f56dab60-8869-40ff-b20d-73973b960af2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#fef7f0',
      showSpinner: false
    }
  }
};

export default config;