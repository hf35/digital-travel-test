import { NewsData, SPACE_NEWS_BASE_URL } from "../types/api";
import { ApiResponse, fetchApi } from "./apiClient";
import { getCachedData, setCachedData } from "./cache";

const CACHE_KEY = "mySpaceNewsCacheKey";

export async function getSpaceNews(): Promise<ApiResponse<NewsData>> {
  // 1. Попытаться взять из кеша
  const cached = await getCachedData<NewsData>(CACHE_KEY);
  if (cached !== null) {
    return {
      ok: true,
      status: 200,
      data: cached,
      error: null,
    };
  }

  // 2. Если нет в кеше → запрос
  const result = await fetchApi<NewsData>(SPACE_NEWS_BASE_URL);
  
  // 3. Если успешно — кэшируем
  if (result.ok && result.data !== null) {
    await setCachedData(CACHE_KEY, result.data);
  }

  // 4. Возвращаем результат (даже если ошибка)
  return result;
}
