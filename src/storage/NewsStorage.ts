import { NewsItem } from "@/services/types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "saved_news";


export const NewsStorage = {
  async getAll(): Promise<NewsItem[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async save(news: NewsItem) {
    const list = await NewsStorage.getAll();

    // исключаем дубли
    const exists = list.find((n) => n.id === news.id);
    if (!exists) {
      list.push(news);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  },

  async remove(id: number) {
    const list = await NewsStorage.getAll();
    const newList = list.filter((n) => n.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  },

  async isSaved(id: number): Promise<boolean> {
    const list = await NewsStorage.getAll();
    return list.some((n) => n.id === id);
  },
};
