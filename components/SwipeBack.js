import { useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet
} from 'react-native';
import { View } from '../theme/themed';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const EDGE_WIDTH = 28;
const SWIPE_DISTANCE = 72;
const SWIPE_VELOCITY = 0.45;

export default function SwipeBack({ enabled = true, onBack, children }) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const translateX = useRef(new Animated.Value(0)).current;
  const dragging = useRef(false);

  const finishBack = () => {
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onBackRef.current?.();
        translateX.setValue(0);
      }
    });
  };

  const cancelSwipe = () => {
    Animated.spring(translateX, {
      toValue: 0,
      friction: 8,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_evt, gesture) => {
          if (!enabledRef.current || !onBackRef.current) return false;
          const mostlyHorizontal =
            gesture.dx > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.2;
          return mostlyHorizontal;
        },
        onMoveShouldSetPanResponderCapture: (_evt, gesture) => {
          if (!enabledRef.current || !onBackRef.current) return false;
          return (
            gesture.dx > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.25
          );
        },
        onPanResponderGrant: () => {
          dragging.current = true;
          translateX.stopAnimation();
        },
        onPanResponderMove: (_evt, gesture) => {
          if (!dragging.current) return;
          translateX.setValue(Math.max(0, Math.min(gesture.dx, SCREEN_WIDTH)));
        },
        onPanResponderRelease: (_evt, gesture) => {
          dragging.current = false;
          const shouldGoBack =
            gesture.dx >= SWIPE_DISTANCE || gesture.vx >= SWIPE_VELOCITY;
          if (shouldGoBack) {
            finishBack();
          } else {
            cancelSwipe();
          }
        },
        onPanResponderTerminate: () => {
          dragging.current = false;
          cancelSwipe();
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [translateX]
  );

  return (
    <View style={styles.root}>
      <Animated.View
        style={[styles.content, { transform: [{ translateX }] }]}
      >
        {children}
      </Animated.View>
      {enabled ? (
        <View style={styles.edge} {...panResponder.panHandlers} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  content: {
    flex: 1,
  },
  edge: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: EDGE_WIDTH,
    zIndex: 100,
  },
});
