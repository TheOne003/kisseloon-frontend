import { useCallback, useLayoutEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { View } from '../theme/themed';

const DURATION = 380;
const DISTANCE_FORWARD = 56;
const DISTANCE_BACK = 44;

/**
 * Soft enter transition: new screen glides in with a fade.
 * Previous screen is replaced underneath a matching canvas (no blank flash).
 */
export function useScreenTransition() {
  const directionRef = useRef('forward');
  const skipRef = useRef(false);
  const busyRef = useRef(false);

  const transitionTo = useCallback((applyScreen, direction = 'forward') => {
    if (busyRef.current) return;
    directionRef.current = direction === 'back' ? 'back' : 'forward';
    skipRef.current = false;
    applyScreen();
  }, []);

  const resetTransition = useCallback(() => {
    skipRef.current = true;
    busyRef.current = false;
  }, []);

  return {
    directionRef,
    skipRef,
    busyRef,
    transitionTo,
    resetTransition,
  };
}

export function ScreenTransitionHost({
  screenKey,
  directionRef,
  skipRef,
  busyRef,
  children,
}) {
  const keyRef = useRef(screenKey);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    if (keyRef.current === screenKey) return;

    const skip = skipRef?.current;
    if (skipRef) skipRef.current = false;
    keyRef.current = screenKey;

    if (skip) {
      opacity.stopAnimation();
      translateX.stopAnimation();
      opacity.setValue(1);
      translateX.setValue(0);
      if (busyRef) busyRef.current = false;
      return;
    }

    const forward = (directionRef?.current || 'forward') !== 'back';
    const enterFrom = forward ? DISTANCE_FORWARD : -DISTANCE_BACK;

    if (busyRef) busyRef.current = true;
    opacity.setValue(0);
    translateX.setValue(enterFrom);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (busyRef) busyRef.current = false;
    });
  }, [screenKey, directionRef, skipRef, busyRef, opacity, translateX]);

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity,
            transform: [{ translateX }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f9ff',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});
