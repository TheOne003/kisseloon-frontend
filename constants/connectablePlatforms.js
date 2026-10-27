export const MIN_COMPARE_PLATFORMS = 2;

export const CONNECTABLE_PLATFORMS = [
  { id: 'swiggy', name: 'Swiggy', shortName: 'Swiggy', category: 'Food' },
  { id: 'zomato', name: 'Zomato', shortName: 'Zomato', category: 'Food' },
  { id: 'toing', name: 'Toing', shortName: 'Toing', category: 'Food' },
  { id: 'bistro-blinkit', name: 'Bistro', shortName: 'Bistro', category: 'Food' },
  { id: 'zepto-cafe', name: 'Zepto Cafe', shortName: 'Zepto Cafe', category: 'Food' },
  { id: 'ownly-rapido', name: 'Ownly', shortName: 'Ownly', category: 'Food' },
  { id: 'blinkit', name: 'Blinkit', shortName: 'Blinkit', category: 'Grocery' },
  { id: 'zepto', name: 'Zepto', shortName: 'Zepto', category: 'Grocery' },
  { id: 'instamart', name: 'Instamart', shortName: 'Instamart', category: 'Grocery' },
  { id: 'amazon-fresh', name: 'Amazon Fresh', shortName: 'Amazon', category: 'Grocery' },
  { id: 'flipkart-minutes', name: 'Flipkart Minutes', shortName: 'Flipkart', category: 'Grocery' },
  { id: 'jiomart', name: 'JioMart', shortName: 'JioMart', category: 'Grocery' },
  { id: 'bigbasket', name: 'BigBasket', shortName: 'BigBasket', category: 'Grocery' },
  { id: 'swish', name: 'Swish', shortName: 'Swish', category: 'Grocery' },
];

export const PLATFORM_CATEGORIES = ['Food', 'Grocery'];

export function getConnectablePlatform(id) {
  return CONNECTABLE_PLATFORMS.find((item) => item.id === id) || null;
}

export function isPlatformActive(connection) {
  return connection?.status === 'connected';
}

export function getActiveConnections(connections = []) {
  return connections.filter(isPlatformActive);
}

export function countActivePlatforms(connections = []) {
  return getActiveConnections(connections).length;
}

export function canComparePrices(connections = []) {
  return countActivePlatforms(connections) >= MIN_COMPARE_PLATFORMS;
}

export function getConnectionById(connections = [], id) {
  return connections.find((item) => item.id === id) || null;
}
