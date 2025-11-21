// src/services/biometricAuth.ts
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const AUTH_KEY = "BIOMETRIC_AUTH_TOKEN";

export async function isBiometricSupported(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
}

export async function authenticate(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Пожалуйста, подтвердите свою личность",
    });
    if (result.success) {
      // можно сохранить просто флаг
      await SecureStore.setItemAsync(AUTH_KEY, "true");
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.warn("Ошибка биометрии", e);
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const val = await SecureStore.getItemAsync(AUTH_KEY);
  return val === "true";
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_KEY);
}
