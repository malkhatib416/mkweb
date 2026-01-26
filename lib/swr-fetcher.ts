/**
 * SWR fetcher function for API requests
 * Used with useSWR hook for data fetching
 */
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `Error: ${res.status}`);
  }

  const data = await res.json();
  return data;
};
