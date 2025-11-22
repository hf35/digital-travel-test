export type ApiResponse<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
};

export async function fetchApi<T>(
  url: string,
  options: RequestInit = {},
  retries = 3,
  retryDelay = 500
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    const status = response.status;
    let data: T | null = null;

    try {
      data = await response.json();
    } catch (err) {
      console.warn("Не удалось распарсить JSON", err);
    }

    // Неуспешный ответ сервера (4xx/5xx)
    if (!response.ok) {
      // Повтор только если ошибка сервера (5xx)
      if (status >= 500 && retries > 0) {
        console.warn(`Ошибка ${status}, повтор запроса... Осталось попыток: ${retries}`);
        await new Promise((res) => setTimeout(res, retryDelay));
        return fetchApi<T>(url, options, retries - 1, retryDelay);
      }

      return { ok: false, status, data, error: `HTTP ошибка: ${status}` };
    }

    // Успешно
    return { ok: true, status, data, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";

    // Повтор при сетевых ошибках (timeout, connection abort и т.д.)
    if (retries > 0) {
      console.warn(`Сетевая ошибка "${errorMessage}", повтор запроса... Осталось попыток: ${retries}`);
      await new Promise((res) => setTimeout(res, retryDelay));
      return fetchApi<T>(url, options, retries - 1, retryDelay);
    }

    return { ok: false, status: 0, data: null, error: errorMessage };
  }
}
