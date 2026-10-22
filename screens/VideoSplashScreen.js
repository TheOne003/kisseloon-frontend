import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';
import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import ThemedStatusBar from '../components/ThemedStatusBar';

const SPLASH_VIDEO = {
  assetId: require('../assets/splash/intro.mp4'),
};

const BRAND_MARK = require('../assets/splash-icon.png');

const FALLBACK_MS = 12000;
const FADE_OUT_MS = 450;

export default function VideoSplashScreen({ onReady, onFinish }) {
  const finishedRef = useRef(false);
  const readyRef = useRef(false);
  const fadingRef = useRef(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const [videoVisible, setVideoVisible] = useState(false);

  const finish = () => {
    if (finishedRef.current || fadingRef.current) return;
    fadingRef.current = true;

    Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_OUT_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished: ok }) => {
      if (!ok) return;
      finishedRef.current = true;
      onFinish?.();
    });
  };

  const markReady = () => {
    if (readyRef.current) return;
    readyRef.current = true;
    onReady?.();
  };

  const player = useVideoPlayer(SPLASH_VIDEO, (instance) => {
    instance.loop = false;
    instance.muted = false;
    instance.audioMixingMode = 'doNotMix';
  });

  useEventListener(player, 'statusChange', ({ status, error }) => {
    if (error) {
      console.warn('Splash video error', error);
      markReady();
      finish();
      return;
    }
    if (status === 'readyToPlay') {
      try {
        player.play();
      } catch {
        // First-frame handler / fallback timer will recover.
      }
    }
  });

  useEventListener(player, 'playToEnd', () => {
    finish();
  });

  useEffect(() => {
    try {
      player.play();
    } catch {
      // Player may not be ready yet; statusChange handler will retry.
    }

    const finishTimer = setTimeout(() => {
      markReady();
      finish();
    }, FALLBACK_MS);

    return () => clearTimeout(finishTimer);
  }, [player]);

  return (
    <Animated.View style={[styles.root, { opacity }]}>
      <ThemedStatusBar hidden />
      {!videoVisible ? (
        <Image source={BRAND_MARK} style={styles.brand} resizeMode="contain" />
      ) : null}
      <VideoView
        style={[styles.video, !videoVisible && styles.videoHidden]}
        player={player}
        contentFit="contain"
        nativeControls={false}
        fullscreenOptions={{ enable: false }}
        playsInline
        onFirstFrameRender={() => {
          setVideoVisible(true);
          markReady();
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    position: 'absolute',
    width: '52%',
    height: '52%',
  },
  video: {
    width: '52%',
    height: '52%',
  },
  videoHidden: {
    opacity: 0,
  },
});
