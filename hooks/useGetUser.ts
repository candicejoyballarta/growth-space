import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetUser(email?: string) {
  const { data, error, mutate } = useSWR(
    email ? `/api/user?email=${email}` : null,
    fetcher
  );

  return {
    profile: data?.user,
    loading: !error && !data,
    error,
    refresh: mutate,
  };
}
