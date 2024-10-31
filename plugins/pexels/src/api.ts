import { useInfiniteQuery } from "@tanstack/react-query"
import * as v from "valibot"

const PEXELS_BASE_URL = "https://framer-pexels-api.sakibulislam25800.workers.dev/v1"
const pageItemCount = 20

const pexelsSourceSchema = v.object({
    original: v.string(),
    large2x: v.string(),
    large: v.string(),
    medium: v.string(),
    small: v.string(),
    tiny: v.string(),
})

const pexelsPhotoSchema = v.object({
    id: v.number(),
    width: v.number(),
    height: v.number(),
    avg_color: v.string(),
    alt: v.string(),
    photographer: v.string(),
    photographer_url: v.string(),
    src: pexelsSourceSchema,
})

const listPhotosSchema = v.object({
    photos: v.array(pexelsPhotoSchema),
    total_results: v.number(),
    page: v.number(),
    per_page: v.number(),
})

export type PexelsPhoto = v.Input<typeof pexelsPhotoSchema>
export type PexelsSource = v.Input<typeof pexelsSourceSchema>
export type PhotoId = number

interface FetchOptions extends Omit<RequestInit, "headers"> {
    // eslint-disable-next-line
    body?: any
}

export async function fetchPexels<TSchema extends v.BaseSchema>(
    path: string,
    schema: TSchema,
    { body, ...options }: FetchOptions = {}
): Promise<v.Input<TSchema>> {
    const response = await fetch(`${PEXELS_BASE_URL}${path}`, {
        body: body ? JSON.stringify(body) : undefined,
        ...options,
    })

    if (!response.ok) {
        throw new Error("Failed to fetch Pexels API:" + response.status)
    }

    const json = (await response.json()) as unknown
    const result = v.safeParse(schema, json)

    if (result.issues) {
        throw new Error("Failed to parse Pexels API response: " + result.issues)
    }

    return result.output
}

export function useListPhotosInfinite(query: string) {
    return useInfiniteQuery({
        queryKey: ["photos", query],
        initialPageParam: 1,
        queryFn: async ({ pageParam, signal }) => {
            const page = pageParam ?? 1

            if (query.length === 0) {
                const result = await fetchPexels(`/curated?page=${page}&per_page=${pageItemCount}`, listPhotosSchema, {
                    signal,
                    method: "GET",
                })
                return {
                    results: result.photos,
                    total: result.total_results,
                    total_pages: Math.ceil(result.total_results / pageItemCount),
                }
            }

            const result = await fetchPexels(
                `/search?query=${query}&page=${page}&per_page=${pageItemCount}`,
                listPhotosSchema,
                { signal, method: "GET" }
            )

            return {
                results: result.photos,
                total: result.total_results,
                total_pages: Math.ceil(result.total_results / pageItemCount),
            }
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.total_pages && lastPage.total_pages > allPages.length) {
                return allPages.length + 1
            }
            return undefined
        },
    })
}

export async function getRandomPhoto(searchTerm: string) {
    const params = new URLSearchParams()
    params.set("per_page", "1")

    if (searchTerm.length > 0) {
        params.set("query", searchTerm)
        const result = await fetchPexels(`/search?${params.toString()}`, listPhotosSchema, { method: "GET" })
        return result.photos[0]
    }

    const result = await fetchPexels(`/curated?${params.toString()}`, listPhotosSchema, { method: "GET" })
    return result.photos[0]
}
