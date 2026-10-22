import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet
} from 'react-native';
import { CartPlusIcon, PlusAddIcon } from './icons';
import { Pressable, Text } from '../theme/themed';

/**
 * Food-style add control: bounce on press, then morphs into a qty stepper.
 */
export default function AddToCartControl({
  qty = 0,
  onAdd,
  onIncrement,
  onDecrement,
  size = 40,
  accessibilityLabel = 'Add to cart',
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const prevQty = useRef(qty);

  useEffect(() => {
    if (qty > 0 && prevQty.current === 0) {
      pop.setValue(0.82);
      Animated.spring(pop, {
        toValue: 1,
        friction: 4,
        tension: 160,
        useNativeDriver: true,
      }).start();
    } else if (qty > prevQty.current && qty > 0) {
      Animated.sequence([
        Animated.timing(pop, {
          toValue: 1.08,
          duration: 90,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(pop, {
          toValue: 1,
          friction: 5,
          tension: 140,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevQty.current = qty;
  }, [pop, qty]);

  const bounceIn = () => {
    Animated.spring(scale, {
      toValue: 0.86,
      friction: 6,
      tension: 220,
      useNativeDriver: true,
    }).start();
  };

  const bounceOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  const handleAdd = () => {
    bounceIn();
    onAdd?.();
    requestAnimationFrame(() => {
      bounceOut();
    });
  };

  if (qty > 0) {
    return (
      <Animated.View
        style={[
          styles.stepper,
          { height: size, transform: [{ scale: pop }] },
        ]}
      >
        <Pressable
          style={styles.qtyBtn}
          onPress={onDecrement}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Decrease quantity"
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </Pressable>
        <Text style={styles.qtyValue}>{qty}</Text>
        <Pressable
          style={styles.qtyBtn}
          onPress={onIncrement}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Increase quantity"
        >
          <PlusAddIcon width={10} height={10} color="#684000" />
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={[
          styles.addBtn,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
        onPress={handleAdd}
        onPressIn={bounceIn}
        onPressOut={bounceOut}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <CartPlusIcon width={16} height={16} color="#684000" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: '#fea619',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  stepper: {
    minWidth: 92,
    borderRadius: 8,
    backgroundColor: '#fff4df',
    borderWidth: 1,
    borderColor: '#fea619',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 2,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: '#684000',
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'Inter_700Bold',
  },
  qtyValue: {
    minWidth: 22,
    textAlign: 'center',
    color: '#684000',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
