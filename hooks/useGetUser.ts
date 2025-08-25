import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetUser(email?: string) {
  const { data, error, mutate } = useSWR(
    email ? `/api/users?email=${email}` : null,
    fetcher
  );

  return {
    profile: data?.data?.[0] ?? null,
    loading: !error && !data,
    error,
    refresh: mutate,
  };
}
