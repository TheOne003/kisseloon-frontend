import { useEffect, useState } from 'react';
import {
  StyleSheet
} from 'react-native';
import BottomSheet from './BottomSheet';
import {
  BriefcaseIcon,
  ChevronRightIcon,
  CrosshairIcon,
  HeartIcon,
  HomeAddrIcon,
  PlusIcon,
  SearchIcon,
} from './icons';
import { Pressable, ScrollView, Text, TextInput, View } from '../theme/themed';

export const SAVED_ADDRESSES = [
  {
    id: 'home',
    label: 'Home',
    city: 'Ghaziabad',
    detail: 'Flat 402, Block C, Maple Heights, Vasundhara, Ghaziabad - 201012',
    icon: 'home',
    accent: true,
  },
  {
    id: 'work',
    label: 'Work',
    city: 'Noida',
    detail: 'Tech Park Tower B, 6th Floor, Sector 62, Noida - 201301',
    icon: 'work',
    accent: false,
  },
  {
    id: 'mom',
    label: "Mom's Place",
    city: 'Ghaziabad',
    detail: 'B-12, Kavi Nagar, near Ram Mandir, Ghaziabad - 201002',
    icon: 'heart',
    accent: false,
  },
];

function AddressIcon({ type }) {
  if (type === 'home') {
    return <HomeAddrIcon width={18} height={18} color="#FEA619" />;
  }
  if (type === 'work') {
    return <BriefcaseIcon width={18} height={18} color="#76777D" />;
  }
  return <HeartIcon width={18} height={18} color="#76777D" />;
}

export default function ChooseLocationSheet({
  visible,
  selectedId = 'home',
  onClose,
  onSelect,
  onUseCurrentLocation,
  onAddAddress,
}) {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(selectedId);

  useEffect(() => {
    if (visible) {
      setActiveId(selectedId);
      setQuery('');
    }
  }, [visible, selectedId]);

  const filtered = SAVED_ADDRESSES.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.detail.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q)
    );
  });

  const handleSelect = (address) => {
    setActiveId(address.id);
    onSelect?.(address);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeight="78%">
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Choose delivery location</Text>
        <Text style={styles.subtitle}>
          Select an address to see prices near you
        </Text>
      </View>

      <View style={styles.searchBar}>
        <SearchIcon width={16} height={16} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search for area, street name..."
          placeholderTextColor="#76777d"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        bounces={false}
      >
        <Pressable style={styles.row} onPress={onUseCurrentLocation}>
          <View style={styles.iconCircleAccent}>
            <CrosshairIcon width={18} height={18} />
          </View>
          <View style={styles.rowTexts}>
            <Text style={styles.rowTitleAccent}>Use current location</Text>
            <Text style={styles.rowSubtitle}>Using GPS</Text>
          </View>
          <ChevronRightIcon width={14} height={14} />
        </Pressable>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>SAVED ADDRESSES</Text>

        {filtered.map((address) => {
          const selected = activeId === address.id;
          return (
            <Pressable
              key={address.id}
              style={styles.row}
              onPress={() => handleSelect(address)}
            >
              <View
                style={[
                  styles.iconCircle,
                  address.accent || selected
                    ? styles.iconCircleAccent
                    : styles.iconCircleMuted,
                ]}
              >
                <AddressIcon type={address.icon} />
              </View>
              <View style={styles.rowTexts}>
                <Text style={styles.rowTitle}>{address.label}</Text>
                <Text style={styles.rowDetail}>{address.detail}</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  selected ? styles.radioSelected : styles.radioIdle,
                ]}
              />
            </Pressable>
          );
        })}

        <View style={styles.divider} />

        <Pressable style={styles.row} onPress={onAddAddress}>
          <View style={styles.iconCircleAccent}>
            <PlusIcon width={18} height={18} />
          </View>
          <Text style={styles.addText}>Add New Address</Text>
          <ChevronRightIcon width={14} height={14} />
        </Pressable>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    gap: 4,
    marginBottom: 16,
  },
  title: {
    color: '#0b1c30',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    color: '#76777d',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  searchBar: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8f9ff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 0,
  },
  listContent: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleAccent: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleMuted: {
    backgroundColor: '#f8f9ff',
  },
  rowTexts: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  rowTitleAccent: {
    color: '#fea619',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  rowSubtitle: {
    color: '#76777d',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  rowDetail: {
    color: '#76777d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  sectionLabel: {
    color: '#76777d',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  radioSelected: {
    borderWidth: 6,
    borderColor: '#fea619',
  },
  radioIdle: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  addText: {
    flex: 1,
    color: '#fea619',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
