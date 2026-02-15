import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useEffect } from 'react-native';
import { BannerAd, BannerAdSize, mobileAds } from 'react-native-google-mobile-ads';

const APP_ID = 'ca-app-pub-3181597249638547~4008060861';
const BANNER_AD_UNIT_ID = 'ca-app-pub-3181597249638547/8998430024';

export default function App() {
  useEffect(() => {
    const initializeMobileAds = async () => {
      try {
        await mobileAds().initialize();
      } catch (error) {
        console.error('Failed to initialize mobile ads:', error);
      }
    };

    initializeMobileAds();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Open up App.tsx to start working on your app!</Text>
      
      <View style={styles.adContainer}>
        <BannerAd
          unitId={BANNER_AD_UNIT_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Open up App.tsx to start working on your app!</Text>
      
      <View style={styles.adContainer}>
        <BannerAd
          unitId={BANNER_AD_UNIT_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    marginBottom: 20,
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
});
