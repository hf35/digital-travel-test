export type ApiResponse<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
};

export async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
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

    if (!response.ok) {
      return { ok: false, status, data, error: `HTTP ошибка: ${status}` };
    }

    return { ok: true, status, data, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";
    return { ok: false, status: 0, data: null, error: errorMessage };
  }
}
