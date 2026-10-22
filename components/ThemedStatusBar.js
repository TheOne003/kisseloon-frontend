import { StatusBar } from 'expo-status-bar';

/** Light-mode status bar (dark icons on light backgrounds). */
export default function ThemedStatusBar(props) {
  return <StatusBar style="dark" {...props} />;
}
