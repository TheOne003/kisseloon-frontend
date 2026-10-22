import * as Location from 'expo-location';

function formatPlaceLabel(place) {
  if (!place) return null;

  const locality =
    place.district ||
    place.subregion ||
    place.city ||
    place.name ||
    place.street;
  const city = place.city || place.subregion || place.region;

  if (locality && city && locality !== city) {
    return `${locality}, ${city}`;
  }

  return locality || city || place.region || null;
}

/**
 * Requests foreground permission, reads GPS, and reverse-geocodes a short label
 * suitable for the home "Deliver to" header.
 */
export async function fetchCurrentLocationLabel() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    const error = new Error('Location permission denied');
    error.code = 'PERMISSION_DENIED';
    throw error;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const places = await Location.reverseGeocodeAsync({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });

  const label = formatPlaceLabel(places?.[0]);
  if (!label) {
    const error = new Error('Unable to resolve address');
    error.code = 'GEOCODE_FAILED';
    throw error;
  }

  return {
    label,
    coords: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },
  };
}
