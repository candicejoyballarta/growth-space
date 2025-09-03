import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetUserStreak(userId?: string) {
  const { data, error, mutate } = useSWR(
    userId ? `/api/users/${userId}/streak` : null,
    fetcher
  );

  return {
    days: data ?? 0,
    loading: !error && !data,
    error,
    refresh: mutate,
  };
}
