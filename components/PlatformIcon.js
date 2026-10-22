import {
  Image,
  StyleSheet
} from 'react-native';
import { getPlatformIcon } from '../constants/platformIcons';
import { View } from '../theme/themed';

export default function PlatformIcon({
  platform,
  id,
  name,
  letter,
  size = 28,
  borderWidth = 1.5,
  style,
}) {
  const source =
    getPlatformIcon(platform) ||
    getPlatformIcon(id) ||
    getPlatformIcon(name) ||
    getPlatformIcon(letter);

  const circle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  };

  if (!source) {
    return <View style={[style, circle]} />;
  }

  return (
    <View style={[style, circle]}>
      <Image
        source={source}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#FFFFFF',
  },
});
