import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
} from 'react-native';

import {
  CheckGreenIcon,
  ScaleIcon,
  SparklesIcon,
  SyncArrowsIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import { HeaderProfileButton } from '../components/HeaderIconButton';
import PlatformIcon from '../components/PlatformIcon';
import {
  CART_ORBIT_CANVAS,
  CART_ORBIT_COLLAPSE_MS,
  CART_ORBIT_EXPAND_MS,
  CART_ORBIT_HUB,
  CART_ORBIT_PHASE_MS,
  CART_ORBIT_PHASES,
  CART_ORBIT_PLATFORMS,
  CART_ORBIT_RINGS,
  getCartChipLabel,
} from '../constants/demoCartCompare';
import { getCartSummary } from '../constants/demoCart';
import { Pressable, SafeAreaView, Text, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const DEFAULT_COPY = {
  headerTitle: 'Cart Comparison',
  headerSubtitle: 'Smart Multi-Platform Comparison',
  listTitle: 'Your cart',
  noteText: 'Comparing this basket across available food & quick-marts',
  phases: CART_ORBIT_PHASES,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_W = Math.min(SCREEN_WIDTH - 32, CART_ORBIT_CANVAS.width);
const CANVAS_H = Math.round((CANVAS_W / CART_ORBIT_CANVAS.width) * CART_ORBIT_CANVAS.height);
const SCALE = CANVAS_W / CART_ORBIT_CANVAS.width;
const NODE = 44 * SCALE;
const HUB_X = CART_ORBIT_HUB.x * SCALE;
const HUB_Y = CART_ORBIT_HUB.y * SCALE;
const CHECK_SIZE = 18 * SCALE;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

function shortestAngleDelta(from, to) {
  let d = to - from;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function nodeAt(angle, radiusMul, platform) {
  const radius = platform.radius * SCALE * radiusMul;
  return {
    left: HUB_X + Math.cos(angle) * radius - NODE / 2,
    top: HUB_Y + Math.sin(angle) * radius - NODE / 2,
  };
}

function OrbitRings() {
  return (
    <View style={styles.ringsWrap} pointerEvents="none">
      {CART_ORBIT_RINGS.map((size) => (
        <View
          key={size}
          style={[
            styles.orbitRing,
            {
              width: size * SCALE,
              height: size * SCALE,
              borderRadius: (size * SCALE) / 2,
            },
          ]}
        />
      ))}
    </View>
  );
}

function PlatformBadge({ platform, left, top, showCheck }) {
  return (
    <View style={[styles.orbitNode, { left, top }]} pointerEvents="none">
      {showCheck ? (
        <View style={[styles.orbitBadge, { backgroundColor: platform.color }]}>
          <CheckGreenIcon
            width={CHECK_SIZE}
            height={CHECK_SIZE}
            color="#FFFFFF"
          />
        </View>
      ) : (
        <PlatformIcon platform={platform} size={NODE - 6 * SCALE} borderWidth={0} />
      )}
    </View>
  );
}

function BouncingDots() {
  const dots = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const loops = dots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 140),
          Animated.timing(dot, {
            toValue: 1,
            duration: 320,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 320,
            useNativeDriver: true,
          }),
        ])
      )
    );
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [dots]);

  return (
    <View style={styles.dotsRow}>
      {dots.map((dot, index) => (
        <Animated.View
          key={`dot-${index}`}
          style={[
            styles.dot,
            {
              opacity: dot.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 1],
              }),
              transform: [
                {
                  translateY: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -3],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

export default function CartComparisonTransitionScreen({
  items = [],
  onBack,
  onFinished,
  copy,
}) {
  const uiCopy = {
    ...DEFAULT_COPY,
    ...copy,
    phases: copy?.phases?.length ? copy.phases : DEFAULT_COPY.phases,
  };
  const phases = uiCopy.phases;
  const summary = useMemo(() => getCartSummary(items), [items]);
  const chips = useMemo(
    () =>
      items.slice(0, 4).map((item) => ({
        id: item.id,
        label: getCartChipLabel(item),
        category: item.category,
      })),
    [items]
  );

  const progressAnim = useRef(new Animated.Value(0.15)).current;
  const syncSpin = useRef(new Animated.Value(0)).current;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [hubComplete, setHubComplete] = useState(false);
  const [showChecks, setShowChecks] = useState(false);
  const [orbitNodes, setOrbitNodes] = useState(() =>
    CART_ORBIT_PLATFORMS.map((p) =>
      nodeAt((p.startDeg * Math.PI) / 180, 1, p)
    )
  );

  const phaseIndexRef = useRef(0);
  const anglesRef = useRef(
    CART_ORBIT_PLATFORMS.map((p) => (p.startDeg * Math.PI) / 180)
  );
  const radiusMulRef = useRef(1);
  const modeRef = useRef('orbit'); // orbit | collapse | expand | done
  const finaleStartedAt = useRef(0);
  const collapseFromAngles = useRef([]);
  const checksShownRef = useRef(false);
  const navigated = useRef(false);

  const phase = phases[phaseIndex] || phases[0];

  useEffect(() => {
    navigated.current = false;
    progressAnim.setValue(0.15);
    phaseIndexRef.current = 0;
    modeRef.current = 'orbit';
    radiusMulRef.current = 1;
    checksShownRef.current = false;
    anglesRef.current = CART_ORBIT_PLATFORMS.map(
      (p) => (p.startDeg * Math.PI) / 180
    );
    setPhaseIndex(0);
    setHubComplete(false);
    setShowChecks(false);
    setOrbitNodes(
      CART_ORBIT_PLATFORMS.map((p) =>
        nodeAt((p.startDeg * Math.PI) / 180, 1, p)
      )
    );

    const syncLoop = Animated.loop(
      Animated.timing(syncSpin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    syncLoop.start();

    let rafId = null;
    let lastTs = Date.now();

    const tick = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;
      const current = CART_ORBIT_PHASES[phaseIndexRef.current];
      const mode = modeRef.current;

      if (mode === 'orbit' && !current?.complete) {
        const speed = current?.speed ?? 1;
        anglesRef.current = anglesRef.current.map((angle, index) => {
          const platform = CART_ORBIT_PLATFORMS[index];
          const omega =
            ((2 * Math.PI) / (platform.periodMs / 1000)) *
            speed *
            (platform.clockwise ? 1 : -1);
          return angle + omega * dt;
        });
        radiusMulRef.current = 1;
      } else if (mode === 'collapse' || mode === 'expand') {
        const elapsed = now - finaleStartedAt.current;
        if (mode === 'collapse') {
          const t = Math.min(elapsed / CART_ORBIT_COLLAPSE_MS, 1);
          const e = easeInOut(t);
          radiusMulRef.current = 1 - e * 0.95;
          anglesRef.current = collapseFromAngles.current.map((from, index) => {
            const to =
              (CART_ORBIT_PLATFORMS[index].settleDeg * Math.PI) / 180;
            return from + shortestAngleDelta(from, to) * e;
          });
          if (t >= 1) {
            modeRef.current = 'expand';
            finaleStartedAt.current = now;
            anglesRef.current = CART_ORBIT_PLATFORMS.map(
              (p) => (p.settleDeg * Math.PI) / 180
            );
          }
        } else {
          const t = Math.min(elapsed / CART_ORBIT_EXPAND_MS, 1);
          const e = easeInOut(t);
          // go farther than the ring, then ease back onto it
          const far = 1.15;
          radiusMulRef.current =
            t < 0.75
              ? 0.05 + e * far
              : far - ((t - 0.75) / 0.25) * (far - 1);
          if (t >= 0.6 && !checksShownRef.current) {
            checksShownRef.current = true;
            setShowChecks(true);
            setHubComplete(true);
          }
          if (t >= 1) {
            radiusMulRef.current = 1;
            modeRef.current = 'done';
            if (!checksShownRef.current) {
              checksShownRef.current = true;
              setShowChecks(true);
              setHubComplete(true);
            }
          }
        }
      }

      setOrbitNodes(
        anglesRef.current.map((angle, index) =>
          nodeAt(angle, radiusMulRef.current, CART_ORBIT_PLATFORMS[index])
        )
      );

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const timers = phases.map((_, index) =>
      setTimeout(() => {
        phaseIndexRef.current = index;
        setPhaseIndex(index);
        if (phases[index].complete && modeRef.current === 'orbit') {
          modeRef.current = 'collapse';
          finaleStartedAt.current = Date.now();
          collapseFromAngles.current = [...anglesRef.current];
        }
      }, index * CART_ORBIT_PHASE_MS)
    );

    Animated.sequence(
      phases.map((step) =>
        Animated.timing(progressAnim, {
          toValue: step.progress,
          duration: CART_ORBIT_PHASE_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      )
    ).start();

    return () => {
      syncLoop.stop();
      if (rafId != null) cancelAnimationFrame(rafId);
      timers.forEach(clearTimeout);
    };
  }, [progressAnim, syncSpin, phases]);

  const fillWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const syncRotate = syncSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const percent = Math.round((phase?.progress || 0) * 100);
  const uiComplete = hubComplete || phase.complete;

  const handleFinish = () => {
    if (navigated.current) return;
    navigated.current = true;
    onFinished?.();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={onBack} />
          <View>
            <Text style={styles.headerTitle}>{uiCopy.headerTitle}</Text>
            <Text style={styles.headerSubtitle}>{uiCopy.headerSubtitle}</Text>
          </View>
        </View>
        <HeaderProfileButton />
      </View>

      <View style={styles.content}>
        <View style={styles.cartCard}>
          <View style={styles.cartTopRow}>
            <View style={styles.cartTitleRow}>
              <Text style={styles.cartTitle}>{uiCopy.listTitle}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {summary.totalCount} item{summary.totalCount === 1 ? '' : 's'}
                </Text>
              </View>
            </View>
            <View style={styles.syncRow}>
              <Animated.View style={{ transform: [{ rotate: syncRotate }] }}>
                <SyncArrowsIcon width={12} height={12} color="#45464D" />
              </Animated.View>
              <Text style={styles.syncText}>Auto Sync</Text>
            </View>
          </View>

          <View style={styles.chipsWrap}>
            {chips.map((chip) => (
              <View key={chip.id} style={styles.chip}>
                <View
                  style={[
                    styles.chipDot,
                    chip.category === 'grocery'
                      ? styles.chipDotGrocery
                      : styles.chipDotFood,
                  ]}
                />
                <Text style={styles.chipText}>{chip.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.noteRow}>
            <ScaleIcon width={13} height={13} />
            <Text style={styles.noteText} numberOfLines={1}>
              {uiCopy.noteText}
            </Text>
          </View>
        </View>

        <View style={[styles.canvas, { width: CANVAS_W, height: CANVAS_H }]}>
          <OrbitRings />

          <View style={styles.hub}>
            {hubComplete ? (
              <>
                <View style={styles.hubPeachRing} />
                <View style={[styles.hubOuter, styles.hubOuterComplete]}>
                  <View style={styles.hubInnerComplete}>
                    <CheckGreenIcon width={28} height={28} color="#059669" />
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.hubOuter}>
                <View style={styles.hubInner}>
                  <Text style={styles.hubKisse}>KISSE</Text>
                  <Text style={styles.hubLoon}>LOON</Text>
                </View>
              </View>
            )}
          </View>

          {CART_ORBIT_PLATFORMS.map((platform, index) => (
            <PlatformBadge
              key={platform.id}
              platform={platform}
              left={orbitNodes[index].left}
              top={orbitNodes[index].top}
              showCheck={showChecks}
            />
          ))}
        </View>

        {uiComplete && showChecks ? (
          <View style={styles.banner}>
            <View style={styles.bannerTitleRow}>
              <SparklesIcon width={16} height={16} color="#059669" />
              <Text style={styles.bannerTitle}>
                {phases[3]?.bannerTitle}
              </Text>
            </View>
            <Text style={styles.bannerSubtitle}>
              {phases[3]?.bannerSubtitle}
            </Text>
          </View>
        ) : (
          <View style={styles.messageBlock}>
            <Text style={styles.messageTitle}>{phase.title}</Text>
            <Text style={styles.messageSubtitle}>{phase.subtitle}</Text>
          </View>
        )}

        <View style={styles.progressBlock}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                showChecks && styles.progressFillDone,
                { width: fillWidth },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>{percent}% Complete</Text>
        </View>

        {uiComplete && showChecks ? (
          <Pressable style={styles.cta} onPress={handleFinish}>
            <Text style={styles.ctaText}>{phases[3]?.ctaLabel}</Text>
          </Pressable>
        ) : (
          <View style={styles.statusCard}>
            <View style={styles.statusLeft}>
              <View style={styles.statusIcon}>
                <Animated.View style={{ transform: [{ rotate: syncRotate }] }}>
                  <SyncArrowsIcon width={18} height={16} color="#684000" />
                </Animated.View>
              </View>
              <View style={styles.statusTextWrap}>
                <Text style={styles.statusTitle}>{phase.statusTitle}</Text>
                <Text style={styles.statusSubtitle}>{phase.statusSubtitle}</Text>
              </View>
            </View>
            <BouncingDots />
          </View>
        )}
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
    backgroundColor: 'rgba(248,249,255,0.85)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  headerSubtitle: {
    color: '#45464d',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 20,
  },
  cartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cartTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cartTitle: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  countBadge: {
    backgroundColor: '#e5eeff',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  countBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncText: {
    color: '#45464d',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff4ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipDotFood: {
    backgroundColor: '#fea619',
  },
  chipDotGrocery: {
    backgroundColor: '#4edea3',
  },
  chipText: {
    color: '#0b1c30',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  noteText: {
    flex: 1,
    color: '#45464d',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  canvas: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  ringsWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(198, 198, 205, 0.45)',
    borderStyle: 'dashed',
  },
  hub: {
    position: 'absolute',
    left: HUB_X - 40 * SCALE,
    top: HUB_Y - 40 * SCALE,
    width: 80 * SCALE,
    height: 80 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  hubPeachRing: {
    position: 'absolute',
    width: 92 * SCALE,
    height: 92 * SCALE,
    borderRadius: 46 * SCALE,
    backgroundColor: 'rgba(254, 166, 25, 0.4)',
  },
  hubOuter: {
    width: 78 * SCALE,
    height: 78 * SCALE,
    borderRadius: 39 * SCALE,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  hubOuterComplete: {
    width: 74 * SCALE,
    height: 74 * SCALE,
    borderRadius: 37 * SCALE,
    shadowOpacity: 0.12,
  },
  hubInner: {
    width: 68 * SCALE,
    height: 68 * SCALE,
    borderRadius: 34 * SCALE,
    backgroundColor: '#f8f9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubInnerComplete: {
    width: 62 * SCALE,
    height: 62 * SCALE,
    borderRadius: 31 * SCALE,
    backgroundColor: '#e5fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubKisse: {
    color: '#0b1c30',
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.4,
  },
  hubLoon: {
    color: '#8a5a00',
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.4,
  },
  orbitNode: {
    position: 'absolute',
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3 * SCALE,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
    zIndex: 3,
  },
  orbitBadge: {
    width: NODE - 6 * SCALE,
    height: NODE - 6 * SCALE,
    borderRadius: (NODE - 6 * SCALE) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  messageBlock: {
    alignItems: 'center',
    gap: 4,
  },
  messageTitle: {
    color: '#0b1c30',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  messageSubtitle: {
    color: '#45464d',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  banner: {
    backgroundColor: '#e5fdf4',
    borderWidth: 1,
    borderColor: '#059669',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerTitle: {
    color: '#059669',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  bannerSubtitle: {
    color: '#059669',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  progressBlock: {
    alignItems: 'center',
    gap: 6,
  },
  progressTrack: {
    width: 260,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#e5eeff',
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#fea619',
  },
  progressFillDone: {
    backgroundColor: '#059669',
  },
  progressLabel: {
    color: '#45464d',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  statusCard: {
    // Solid fill — translucent + elevation made a muddy halo on Android.
    backgroundColor: '#fdecd8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
      },
      android: {
        elevation: 0,
      },
    }),
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextWrap: {
    flex: 1,
    paddingRight: 8,
    minWidth: 0,
    justifyContent: 'center',
    gap: 2,
  },
  statusTitle: {
    color: '#0b1c30',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Inter_600SemiBold',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  statusSubtitle: {
    color: '#653e00',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Inter_400Regular',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#653e00',
  },
  cta: {
    backgroundColor: '#059669',
    borderRadius: 12,
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 1,
      },
    }),
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
});
