import useSWR from "swr"

import type { UserData } from "@/app/features/profile/types"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Kunde inte hämta användardata")
  return res.json()
}

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR("/api/users/me", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 600000,
    retryCount: 3,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      setTimeout(() => revalidate({ retryCount }), 5000)
    },
    keepPreviousData: true,
  })

  return {
    user: data?.user as UserData,
    isLoading,
    isError: error,
    mutate,
  }
}
