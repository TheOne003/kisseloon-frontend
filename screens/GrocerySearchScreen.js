import { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet
} from 'react-native';

import {
  ArrowRightFillIcon,
  ArrowUpRightIcon,
  ClearSearchIcon,
  MilkBoxIcon,
  MilkDropIcon,
  MilkSmallIcon,
  SearchIcon20,
  SearchSuggestIcon,
} from '../components/icons';
import BackButton from '../components/BackButton';
import { HeaderProfileButton } from '../components/HeaderIconButton';
import { getDemoGrocerySearch } from '../constants/demoGrocerySearch';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from '../theme/themed';
import ThemedStatusBar from '../components/ThemedStatusBar';

function ProductIcon({ type }) {
  if (type === 'box') return <MilkBoxIcon width={17} height={17} />;
  if (type === 'small') return <MilkSmallIcon width={12} height={16} />;
  return <MilkDropIcon width={13} height={17} />;
}

function ProductRow({ item, isLast, onPress }) {
  return (
    <>
      <Pressable style={styles.productRow} onPress={() => onPress?.(item)}>
        <View style={styles.productLeft}>
          <View style={styles.productIconWrap}>
            <ProductIcon type={item.icon} />
          </View>
          <View style={styles.productTexts}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <ArrowRightFillIcon width={12} height={12} />
      </Pressable>
      {!isLast ? <View style={styles.separator} /> : null}
    </>
  );
}

function RelatedRow({ item, isLast, onPress }) {
  return (
    <>
      <Pressable style={styles.relatedRow} onPress={() => onPress?.(item)}>
        <View style={styles.relatedLeft}>
          <SearchSuggestIcon width={14} height={14} />
          <Text style={styles.relatedText} numberOfLines={1}>
            <Text style={styles.relatedBrand}>{item.brand}</Text>
            <Text style={styles.relatedRest}>{item.rest}</Text>
          </Text>
        </View>
        <ArrowUpRightIcon width={10} height={10} />
      </Pressable>
      {!isLast ? <View style={styles.separator} /> : null}
    </>
  );
}

export default function GrocerySearchScreen({
  initialQuery = 'Amul Gold Milk',
  onBack,
  onProfile,
  onSelectProduct,
  onSelectSuggestion,
}) {
  const [query, setQuery] = useState(initialQuery);
  const result = useMemo(() => getDemoGrocerySearch(query), [query]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedStatusBar />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={onBack} />
          <Text style={styles.headerTitle}>Grocery Search</Text>
        </View>
        <HeaderProfileButton onPress={onProfile} />
      </View>

      <View style={styles.searchHeader}>
        <View style={styles.searchShell}>
          <SearchIcon20 width={15} height={15} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search groceries, brands or products"
            placeholderTextColor="#76777d"
            autoFocus
            returnKeyType="search"
          />
          {query ? (
            <Pressable
              style={styles.clearButton}
              onPress={() => setQuery('')}
              accessibilityLabel="Clear search"
            >
              <ClearSearchIcon width={9} height={9} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {result.products.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>Products</Text>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchBadgeText}>
                    {result.products.length} matches
                  </Text>
                </View>
              </View>
              <Text style={styles.liveCatalog}>Live catalog</Text>
            </View>

            <View style={styles.card}>
              {result.products.map((item, index) => (
                <ProductRow
                  key={item.id}
                  item={item}
                  isLast={index === result.products.length - 1}
                  onPress={onSelectProduct}
                />
              ))}
            </View>
          </View>
        ) : query.trim() ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>
              Try demo query “Amul Gold Milk”.
            </Text>
          </View>
        ) : null}

        {result.related.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related suggestions</Text>
            <View style={styles.card}>
              {result.related.map((item, index) => (
                <RelatedRow
                  key={item.id}
                  item={item}
                  isLast={index === result.related.length - 1}
                  onPress={(suggestion) => {
                    const next = `${suggestion.brand}${suggestion.rest}`.trim();
                    setQuery(next);
                    onSelectSuggestion?.(suggestion);
                  }}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
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
    backgroundColor: 'rgba(248,249,255,0.8)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  headerTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 12,
    backgroundColor: '#f8f9ff',
  },
  searchShell: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter_600SemiBold',
    paddingVertical: 0,
    paddingRight: 28,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dce9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 20,
    paddingBottom: 28,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  matchBadge: {
    backgroundColor: '#d3e4fe',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  matchBadgeText: {
    color: '#45464d',
    fontSize: 10,
    letterSpacing: 0.4,
    fontFamily: 'Inter_700Bold',
  },
  liveCatalog: {
    color: '#855300',
    fontSize: 10,
    letterSpacing: 0.4,
    fontFamily: 'Inter_600SemiBold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  productRow: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  productIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#e5eeff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productTexts: {
    flex: 1,
  },
  productName: {
    color: '#0b1c30',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  productSubtitle: {
    color: '#059669',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_500Medium',
  },
  separator: {
    height: 1,
    backgroundColor: '#eff4ff',
  },
  relatedRow: {
    height: 48,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  relatedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  relatedText: {
    flex: 1,
  },
  relatedBrand: {
    color: '#0b1c30',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  relatedRest: {
    color: '#45464d',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  emptyTitle: {
    color: '#0b1c30',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  emptySubtitle: {
    color: '#76777d',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
