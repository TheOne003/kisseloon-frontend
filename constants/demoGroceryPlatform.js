export const DEMO_GROCERY_PLATFORM_SELECTION = {
  itemTitle: 'Amul Gold Milk',
  packLabel: '1 L',
  brandLine: 'Amul Dairy',
  stockLabel: 'In Stock',
  image: require('../assets/grocery/amul-gold-detail.jpg'),
  platforms: [
    {
      id: 'blinkit',
      name: 'Blinkit',
      mark: 'b!',
      markBg: '#f8e831',
      markColor: '#0d6b30',
      subtitle: 'Grocery delivery • 11 mins',
      price: 74,
      priceNote: 'Standard',
      priceNoteTone: 'muted',
    },
    {
      id: 'zepto',
      name: 'Zepto',
      mark: 'z',
      markBg: '#52006a',
      markColor: '#ff3269',
      subtitle: 'Grocery delivery • 8 mins',
      price: 76,
      priceNote: '+₹4 surge',
      priceNoteTone: 'muted',
    },
    {
      id: 'instamart',
      name: 'Instamart',
      mark: 'I',
      markBg: '#fc8019',
      markColor: '#fff',
      subtitle: 'Save ₹4 instantly',
      price: 72,
      priceNote: 'LOWEST',
      priceNoteTone: 'best',
      best: true,
      saveLabel: 'Save ₹4 instantly',
    },
  ],
};

export function getGroceryPlatformSelectionDemo(product) {
  const demo = DEMO_GROCERY_PLATFORM_SELECTION;
  const platforms = product?.platforms?.length
    ? product.platforms
        .filter((p) => !p.unavailable)
        .map((platform) => {
          const fallback = demo.platforms.find((p) => p.id === platform.id);
          const isBest = !!platform.best;
          return {
            id: platform.id,
            name: platform.name,
            mark:
              fallback?.mark ||
              platform.letter ||
              platform.name?.[0] ||
              '?',
            markBg: fallback?.markBg || platform.color || '#eff4ff',
            markColor: fallback?.markColor || '#fff',
            subtitle: isBest
              ? `Save ₹${product.saveAmount || 4} instantly`
              : `Grocery delivery • ${platform.time?.replace(' delivery', '') || '—'}`,
            price: platform.price,
            priceNote: isBest
              ? 'LOWEST'
              : platform.id === 'zepto'
                ? '+₹4 surge'
                : 'Standard',
            priceNoteTone: isBest ? 'best' : 'muted',
            best: isBest,
            saveLabel: isBest
              ? `Save ₹${product.saveAmount || 4} instantly`
              : undefined,
          };
        })
    : demo.platforms;

  const prices = platforms.map((p) => p.price);
  const bestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const best = platforms.find((p) => p.best) || platforms.find((p) => p.price === bestPrice);

  return {
    ...demo,
    itemTitle: product?.name || demo.itemTitle,
    packLabel: product?.packSize?.replace(' Pouch', '') || demo.packLabel,
    image: product?.image || demo.image,
    platforms,
    bestPrice,
    highestPrice,
    saveAmount: highestPrice - bestPrice,
    defaultPlatformId: best?.id || 'instamart',
  };
}
