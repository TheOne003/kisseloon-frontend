import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet
} from 'react-native';

import {
  LocationChevronIcon,
  LocationPinIcon,
  PiggyBankStrokeIcon,
} from '../components/icons';
import { HeaderCartButton } from '../components/HeaderIconButton';
import PlatformIcon from '../components/PlatformIcon';
import { Pressable, SafeAreaView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRACK_INNER = SCREEN_WIDTH - 64; // page 16 + card 16 each side
const START_LEFT = 28;
const FINISH_LEFT = Math.max(TRACK_INNER - 110, 180);

const RACERS = [
  {
    id: 'swiggy',
    name: 'Swiggy',
    price: 220,
    priceColor: '#fc8019',
    laneBg: '#fff5eb',
    trailColor: 'rgba(252,128,25,0.33)',
    progress: 0.38,
    duration: 2200,
  },
  {
    id: 'zomato',
    name: 'Zomato',
    price: 205,
    priceColor: '#cb202d',
    laneBg: '#fff0f2',
    trailColor: 'rgba(203,32,45,0.33)',
    progress: 0.55,
    duration: 2000,
  },
  {
    id: 'toing',
    name: 'Toing',
    price: 190,
    priceColor: '#059669',
    laneBg: '#eefbf5',
    trailColor: 'rgba(0,181,98,0.33)',
    progress: 0.82,
    duration: 1700,
    winner: true,
  },
];

function RaceLane({ racer, anim }) {
  const maxTravel = FINISH_LEFT - START_LEFT;
  const target = START_LEFT + maxTravel * racer.progress;

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [START_LEFT, target],
  });

  const trailWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, Math.max(target - 20, 40)],
  });

  return (
    <View style={[styles.lane, { backgroundColor: racer.laneBg }]}>
      <Animated.View
        style={[
          styles.trail,
          {
            width: trailWidth,
            backgroundColor: racer.trailColor,
          },
        ]}
      />
      <Animated.View style={[styles.racerPackage, { transform: [{ translateX }] }]}>
        <View style={styles.logoDisc}>
          <PlatformIcon platform={racer} size={44} />
        </View>
        <View style={styles.stats}>
          <Text style={styles.racerName}>{racer.name}</Text>
          <Text style={[styles.racerPrice, { color: racer.priceColor }]}>
            ₹{racer.price}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

export default function PriceRaceScreen({
  location = 'Ghaziabad',
  racers: racersProp,
  savingsTitle = 'Save ₹30 on your order!',
  savingsSubtitle = 'Toing has the lowest price today. Compare, order and save instantly.',
  proceedLabel = 'Proceed with Toing',
  onCart,
  onFinished,
  onProceed,
}) {
  const racers = racersProp?.length ? racersProp : RACERS;
  const animsRef = useRef([]);
  if (animsRef.current.length !== racers.length) {
    animsRef.current = racers.map(() => new Animated.Value(0));
  }
  const anims = animsRef.current;
  const [raceDone, setRaceDone] = useState(false);
  const navigated = useRef(false);
  const winnerName =
    racers.find((racer) => racer.winner)?.name ||
    proceedLabel.replace('Proceed with ', '');
  const raceKey = racers.map((racer) => racer.id).join('|');

  useEffect(() => {
    anims.forEach((anim) => anim.setValue(0));
    setRaceDone(false);
    navigated.current = false;

    Animated.stagger(
      120,
      racers.map((racer, index) =>
        Animated.timing(anims[index], {
          toValue: 1,
          duration: racer.duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      )
    ).start(({ finished }) => {
      if (finished) {
        setRaceDone(true);
      }
    });
  }, [anims, raceKey, racers]);

  useEffect(() => {
    if (!raceDone) return undefined;
    const timer = setTimeout(() => {
      if (!navigated.current) {
        navigated.current = true;
        onFinished?.();
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [raceDone, onFinished]);

  const handleProceed = () => {
    if (navigated.current) return;
    navigated.current = true;
    onProceed?.();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.locationBlock}>
          <Text style={styles.deliverLabel}>DELIVER TO</Text>
          <View style={styles.locationRow}>
            <LocationPinIcon width={12} height={14} />
            <Text style={styles.locationText}>{location}</Text>
            <LocationChevronIcon width={8} height={5} />
          </View>
        </View>
        <HeaderCartButton onPress={onCart} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Get Set, Go! 🏁</Text>
          <Text style={styles.subtitle}>
            {raceDone
              ? 'Price race complete — best deal found.'
              : 'Real-time price race in progress...'}
          </Text>
        </View>

        <View style={styles.trackCard}>
          <View style={styles.labelsRow}>
            <Text style={styles.startLabel}>START</Text>
            <Text style={styles.finishLabel}>FINISH</Text>
          </View>

          <View style={styles.lanesArea}>
            <View style={styles.startLine} />
            <View style={styles.node} />
            <View style={[styles.node, styles.nodeMid]} />
            <View style={[styles.node, styles.nodeBottom]} />
            <View style={styles.finishLine} />
            <Text style={styles.finishFlag}>🏁</Text>

            <View style={styles.lanesStack}>
              {racers.map((racer, index) => (
                <RaceLane key={racer.id} racer={racer} anim={anims[index]} />
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.savingsCard, !raceDone && styles.savingsCardHidden]}>
          <View style={styles.piggyWrap}>
            <PiggyBankStrokeIcon width={18} height={18} />
          </View>
          <View style={styles.savingsTexts}>
            <Text style={styles.savingsTitle}>{savingsTitle}</Text>
            <Text style={styles.savingsSubtitle}>{savingsSubtitle}</Text>
          </View>
        </View>

        <Pressable
          style={[styles.cta, !raceDone && styles.ctaDisabled]}
          disabled={!raceDone}
          onPress={handleProceed}
        >
          <Text style={styles.ctaText}>
            {proceedLabel || `Proceed with ${winnerName}`}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationBlock: {
    gap: 2,
  },
  deliverLabel: {
    color: '#76777d',
    fontSize: 10,
    letterSpacing: 0.5,
    fontFamily: 'Inter_700Bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 24,
  },
  titleBlock: {
    gap: 6,
  },
  title: {
    color: '#0b1c30',
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.5,
    fontFamily: 'Inter_800ExtraBold',
  },
  subtitle: {
    color: '#76777d',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  trackCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  startLabel: {
    color: '#76777d',
    fontSize: 10,
    letterSpacing: 1,
    fontFamily: 'Inter_800ExtraBold',
  },
  finishLabel: {
    color: '#fea619',
    fontSize: 10,
    letterSpacing: 1,
    fontFamily: 'Inter_800ExtraBold',
  },
  lanesArea: {
    height: 240,
    position: 'relative',
  },
  lanesStack: {
    gap: 12,
  },
  lane: {
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  trail: {
    position: 'absolute',
    left: 36,
    top: 16,
    height: 40,
    borderRadius: 8,
    opacity: 0.9,
  },
  racerPackage: {
    position: 'absolute',
    top: 14,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoDisc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  stats: {
    gap: 2,
  },
  racerName: {
    color: '#0b1c30',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  racerPrice: {
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
  startLine: {
    position: 'absolute',
    left: 24,
    top: 10,
    width: 2,
    height: 220,
    backgroundColor: '#c6c6cd',
    zIndex: 2,
  },
  finishLine: {
    position: 'absolute',
    left: 312,
    top: 10,
    width: 2,
    height: 220,
    borderStyle: 'dashed',
    borderLeftWidth: 2,
    borderColor: '#fea619',
    zIndex: 2,
  },
  finishFlag: {
    position: 'absolute',
    left: 302,
    top: -8,
    fontSize: 16,
    zIndex: 3,
  },
  node: {
    position: 'absolute',
    left: 21,
    top: 32,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c6c6cd',
    zIndex: 3,
  },
  nodeMid: {
    top: 116,
  },
  nodeBottom: {
    top: 200,
  },
  savingsCard: {
    backgroundColor: '#eefbf5',
    borderWidth: 1,
    borderColor: 'rgba(0,181,98,0.2)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savingsCardHidden: {
    opacity: 0,
  },
  piggyWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(5,150,105,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsTexts: {
    flex: 1,
    gap: 2,
  },
  savingsTitle: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
  savingsSubtitle: {
    color: '#76777d',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_400Regular',
  },
  cta: {
    backgroundColor: '#fea619',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaDisabled: {
    opacity: 0.45,
  },
  ctaText: {
    color: '#684000',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
