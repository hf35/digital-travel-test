import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext';
import { SavedNewsProvider } from '@/context/SavedNewsContext';
import { Platform, StyleSheet } from 'react-native';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { ToastProvider } from 'react-native-paper-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function RootLayout() {

  return (
    <AuthProvider >
      <SavedNewsProvider>
        <ThemeProvider value={DefaultTheme}>
          <SafeAreaView style={styles.safeArea} edges={Platform.select({ default: ['top'] })} >
            <PaperProvider theme={MD3LightTheme}><ToastProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="dark" />
            </ToastProvider></PaperProvider>

          </SafeAreaView>
        </ThemeProvider>
      </SavedNewsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "white" }
})