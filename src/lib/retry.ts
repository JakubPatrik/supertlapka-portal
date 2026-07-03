// Source - https://stackoverflow.com/a/73295995
// Posted by Jonas Wilms
// Retrieved 2026-06-05, License - CC BY-SA 4.0

interface FetchRetryOptions {
  retries?: number;
  retryDelayMs?: number;
  isRetryable?: (response: Response) => boolean;
  onRetry?: (attempt: number, error: unknown) => void;
}

export async function fetchRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  {
    retries = 3,
    retryDelayMs = 1000,
    isRetryable = (res) => res.status >= 500,
    onRetry,
  }: FetchRetryOptions = {},
): Promise<Response> {
  let attempt = 0;
  while (true) {
    attempt += 1;
    try {
      const response = await fetch(input, init);
      if (!response.ok && isRetryable(response) && attempt < retries) {
        onRetry?.(attempt, null);
        await new Promise((r) => setTimeout(r, retryDelayMs * 2 ** (attempt - 1)));
        continue;
      }
      return response;
    } catch (error) {
      if (attempt < retries) {
        onRetry?.(attempt, error);
        await new Promise((r) => setTimeout(r, retryDelayMs * 2 ** (attempt - 1)));
        continue;
      }
      throw error;
    }
  }
}
