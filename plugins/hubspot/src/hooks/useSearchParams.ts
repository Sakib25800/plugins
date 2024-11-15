import { useSearch } from "wouter"
import { useMemo } from "react"

export const useSearchParams = <T extends Record<string, string>>() => {
    const searchString = useSearch()

    // Parse current search params
    const params = useMemo(() => {
        const searchParams = new URLSearchParams(searchString)
        return Object.fromEntries(searchParams.entries()) as T
    }, [searchString])

    return [params] as const
}
