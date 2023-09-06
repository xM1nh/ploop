/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInView } from "react-cool-inview"
import { useState, useEffect, useCallback } from "react"
import { UseLazyQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks"

const useInfiniteScroll = (lazyQuery: UseLazyQuery<any>, queryParams?: any) => {
    const [page, setPage] = useState(1)
    const [combinedData, setCombinedData] = useState<any>([])
    const [fetchMore, setFetchMore] = useState(true)

    const [
        trigger,
        {
            data,
            isLoading,
            isFetching
        },
        lastPromiseInfo
    ] = lazyQuery()

    const { observe } = useInView({
        threshold: 0.8,
        onEnter: ({unobserve}) => {
            unobserve()
            if (fetchMore && !isFetching) {
                setPage(page => page + 1)
            }
        }
    })

    useEffect(() => {
        const result = trigger({
            page,
            count: 1,
            ...queryParams
        })
        result
            .unwrap()
            .then((data: any) => {
                setCombinedData((prev: never) => [...prev, ...(data ?? [])])
                if (data.length === 0) setFetchMore(false)
            })
            .catch(console.error)

        return result.unsubscribe
    }, [trigger, page, queryParams])

    const refresh = useCallback(() => {
        setPage(1)
    }, [])

    return {
        combinedData,
        data,
        page,
        refresh,
        isFetching,
        isLoading,
        itemRef: observe,
        lastArg: lastPromiseInfo.lastArg
    }
}

export default useInfiniteScroll