import AsyncStorage from "@react-native-async-storage/async-storage";

type CacheItem<T> = {
  timestamp: number;
  data: T;
};

const DEFAULT_TTL = 10 * 60 * 1000; // 5 минут

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    if (!json) return null;

    const item: CacheItem<T> = JSON.parse(json);
    const now = Date.now();

    if (now - item.timestamp < DEFAULT_TTL) {
      return item.data;
    } else {
      // устарело
      await AsyncStorage.removeItem(key);
      return null;
    }
  } catch (e) {
    console.warn("Ошибка чтения кеша", e);
    return null;
  }
}

export async function setCachedData<T>(key: string, data: T): Promise<void> {
  try {
    const item: CacheItem<T> = {
      timestamp: Date.now(),
      data,
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.warn("Ошибка записи кеша", e);
  }
}
