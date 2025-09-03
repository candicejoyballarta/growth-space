import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetUserGoals(userId?: string) {
  const { data, error, mutate } = useSWR(`/api/users/${userId}/goals`, fetcher);

  return {
    goals: data ?? [],
    loading: !error && !data,
    error,
    refresh: mutate,
  };
}
