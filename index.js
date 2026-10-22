import { registerRootComponent } from 'expo';
import * as SystemUI from 'expo-system-ui';

import App from './App';

// Start on white to match splash; App switches to #f8f9ff after intro / skip.
SystemUI.setBackgroundColorAsync('#ffffff').catch(() => {});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
