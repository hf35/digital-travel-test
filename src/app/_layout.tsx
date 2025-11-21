import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext';
import { SavedNewsProvider } from '@/context/SavedNewsContext';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {

  return (
    <AuthProvider >
      <SavedNewsProvider>
      <ThemeProvider value={DefaultTheme}>
        <SafeAreaView style={{ flex: 1, backgroundColor:"white" }} edges={Platform.select({ default: ['top'] })} >

          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
          </Stack>
          <StatusBar style="dark"  />
        </SafeAreaView>
      </ThemeProvider>
      </SavedNewsProvider>
    </AuthProvider>
  );
}
