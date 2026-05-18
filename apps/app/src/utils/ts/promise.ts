export async function mapWithConcurrencyLimit<T, TResult>(
  items: T[],
  concurrency: number,
  iteratee: (item: T, index: number) => Promise<TResult>,
  onResolved?: (result: TResult, index: number) => void
) {
  if (items.length === 0) {
    return [];
  }

  const results = new Array<TResult>(items.length);
  const workerCount = Math.max(1, Math.min(concurrency, items.length));
  let nextIndex = 0;
  let isAborted = false;

  const workers = Array.from({ length: workerCount }, async () => {
    while (true) {
      if (isAborted) return;

      const currentIndex = nextIndex++;

      if (currentIndex >= items.length) {
        return;
      }

      if (isAborted) return;

      try {
        const result = await iteratee(items[currentIndex], currentIndex);

        if (isAborted) return;

        results[currentIndex] = result;
        onResolved?.(result, currentIndex);
      } catch (error) {
        isAborted = true;
        throw error;
      }
    }
  });

  await Promise.all(workers);

  return results;
}
