import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native';

import {
  BriefcaseIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CrosshairIcon,
  HomeAddrIcon,
  MapPinSmallIcon,
  MapPinStrokeIcon,
  TagIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

const LABELS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'work', label: 'Work', icon: 'work' },
  { id: 'other', label: 'Other', icon: 'other' },
];

function LabelIcon({ type, selected }) {
  const color = selected ? '#fff' : '#76777D';
  if (type === 'home') return <HomeAddrIcon width={16} height={16} color={color} />;
  if (type === 'work') return <BriefcaseIcon width={16} height={16} color={color} />;
  return <TagIcon width={16} height={16} color={color} />;
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  showCheck,
  keyboardType,
  flex,
}) {
  return (
    <View style={[styles.field, flex && styles.fieldFlex]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInput}>
        <TextInput
          style={[styles.input, value ? styles.inputFilled : null]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#76777d"
          keyboardType={keyboardType}
        />
        {showCheck && <CheckCircleIcon width={16} height={16} />}
      </View>
    </View>
  );
}

export default function AddNewAddressScreen({ onBack, onSave }) {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('Ghaziabad');
  const [pincode, setPincode] = useState('201012');
  const [state, setState] = useState('Uttar Pradesh');
  const [label, setLabel] = useState('home');
  const [mapLabel, setMapLabel] = useState('Maple Heights, Vasundhara');

  const canSave =
    line1.trim().length > 0 &&
    city.trim().length > 0 &&
    pincode.trim().length > 0 &&
    state.trim().length > 0;

  const handleUseCurrent = () => {
    setCity('Ghaziabad');
    setPincode('201012');
    setState('Uttar Pradesh');
    setMapLabel('Current location');
    if (!line2) setLine2('Maple Heights, Vasundhara');
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave?.({
      label,
      line1: line1.trim(),
      line2: line2.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      state: state.trim(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.headerTitle}>Add New Address</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.map}>
            <View style={[styles.mapBlock, styles.mapBlockGreenA]} />
            <View style={[styles.mapBlock, styles.mapBlockBlue]} />
            <View style={[styles.mapBlock, styles.mapBlockGreenB]} />
            <View style={[styles.mapRoad, styles.mapRoadH1]} />
            <View style={[styles.mapRoad, styles.mapRoadH2]} />
            <View style={[styles.mapRoad, styles.mapRoadV1]} />
            <View style={[styles.mapRoad, styles.mapRoadV2]} />

            <View style={styles.mapBubble}>
              <MapPinSmallIcon width={14} height={14} />
              <Text style={styles.mapBubbleText}>{mapLabel}</Text>
            </View>

            <View style={styles.centerPinWrap}>
              <View style={styles.pinShadow} />
              <View style={styles.centerPin}>
                <MapPinStrokeIcon width={20} height={20} color="#fff" />
              </View>
            </View>
          </View>

          <Pressable style={styles.gpsRow} onPress={handleUseCurrent}>
            <View style={styles.gpsIcon}>
              <CrosshairIcon width={18} height={18} />
            </View>
            <View style={styles.gpsTexts}>
              <Text style={styles.gpsTitle}>Use current location</Text>
              <Text style={styles.gpsSubtitle}>
                Using GPS to pinpoint your current location
              </Text>
            </View>
            <ChevronRightIcon width={14} height={14} />
          </Pressable>

          <View style={styles.form}>
            <Field
              label="Address Line 1"
              value={line1}
              onChangeText={setLine1}
              placeholder="House/Flat/Floor No. (e.g. Flat 402, Block C)"
            />
            <Field
              label="Address Line 2"
              value={line2}
              onChangeText={setLine2}
              placeholder="Area, Colony, Street (e.g. Maple Heights, Vasundhara)"
            />

            <View style={styles.doubleRow}>
              <Field
                label="City"
                value={city}
                onChangeText={setCity}
                placeholder="City"
                showCheck={city.trim().length > 0}
                flex
              />
              <Field
                label="Pincode"
                value={pincode}
                onChangeText={(v) => setPincode(v.replace(/\D/g, '').slice(0, 6))}
                placeholder="Pincode"
                showCheck={pincode.trim().length === 6}
                keyboardType="number-pad"
                flex
              />
            </View>

            <Field
              label="State"
              value={state}
              onChangeText={setState}
              placeholder="State"
              showCheck={state.trim().length > 0}
            />

            <View style={styles.labelSection}>
              <Text style={styles.fieldLabel}>Save Address As</Text>
              <View style={styles.pills}>
                {LABELS.map((item) => {
                  const selected = label === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      style={[styles.pill, selected && styles.pillSelected]}
                      onPress={() => setLabel(item.id)}
                    >
                      <LabelIcon type={item.icon} selected={selected} />
                      <Text
                        style={[
                          styles.pillText,
                          selected && styles.pillTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.bottomAction}>
            <Pressable
              style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
              disabled={!canSave}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>Save Address</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  flex: {
    flex: 1,
  },
  header: {
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#0b1c30',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    lineHeight: 24,
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  map: {
    height: 200,
    backgroundColor: '#e8eff8',
    overflow: 'hidden',
  },
  mapBlock: {
    position: 'absolute',
    borderRadius: 8,
  },
  mapBlockGreenA: {
    width: 50,
    height: 50,
    left: 10,
    top: 60,
    backgroundColor: '#e1f2e5',
    borderRadius: 6,
  },
  mapBlockBlue: {
    width: 110,
    height: 100,
    left: 110,
    top: 10,
    backgroundColor: '#d1e2ff',
    borderRadius: 12,
  },
  mapBlockGreenB: {
    width: 90,
    height: 40,
    left: 260,
    top: 150,
    backgroundColor: '#e1f2e5',
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  mapRoadH1: {
    left: 0,
    right: 0,
    top: 40,
    height: 10,
  },
  mapRoadH2: {
    left: 0,
    right: 0,
    top: 130,
    height: 12,
  },
  mapRoadV1: {
    top: 0,
    bottom: 0,
    left: 80,
    width: 10,
  },
  mapRoadV2: {
    top: 0,
    bottom: 0,
    left: 240,
    width: 8,
  },
  mapBubble: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    left: '18%',
    right: '18%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  mapBubbleText: {
    color: '#0b1c30',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  centerPinWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 48,
    height: 48,
    marginLeft: -24,
    marginTop: -24,
    alignItems: 'center',
  },
  pinShadow: {
    position: 'absolute',
    bottom: 4,
    width: 16,
    height: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  centerPin: {
    marginTop: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fea619',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fea619',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  gpsRow: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gpsIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsTexts: {
    flex: 1,
    gap: 2,
  },
  gpsTitle: {
    color: '#fea619',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  gpsSubtitle: {
    color: '#76777d',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    lineHeight: 14,
  },
  form: {
    padding: 16,
    gap: 14,
  },
  field: {
    gap: 6,
  },
  fieldFlex: {
    flex: 1,
  },
  fieldLabel: {
    color: '#76777d',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  fieldInput: {
    height: 44,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    color: '#76777d',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    lineHeight: 20,
    paddingVertical: 0,
  },
  inputFilled: {
    color: '#0b1c30',
  },
  doubleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  labelSection: {
    gap: 8,
    paddingTop: 6,
  },
  pills: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pillSelected: {
    backgroundColor: '#fea619',
    borderColor: '#fea619',
  },
  pillText: {
    color: '#76777d',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  pillTextSelected: {
    color: '#fff',
  },
  bottomAction: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  saveBtn: {
    backgroundColor: '#fea619',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fea619',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnDisabled: {
    opacity: 0.55,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    lineHeight: 24,
  },
});
