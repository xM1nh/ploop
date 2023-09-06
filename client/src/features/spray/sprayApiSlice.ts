import apiSlice from "../../app/api/apiSlice";

interface Spray {
    id: number
}

const sprayApiSlice = apiSlice.injectEndpoints({
    overrideExisting: false,
    endpoints: builder => ({
        getSprays: builder.query({
            query: ({page, count}) => `/sprays?page=${page}&count=${count}`,
        }),
        getSpray: builder.query<Spray, void>({
            query: id => `/sprays/${id}`
        }),
        getSpraysForUser: builder.query<Spray[], {id: number, page: number, count: number}>({
            query: ({id, page, count}) => `/sprays/${id}?page=${page}&count=${count}`
        }),
        deleteSpray: builder.mutation<void, {id: number}>({
            query: id => ({
                url: `/sprays/${id}`,
                method: 'DELETE'
            })
        })
    })
})

export const {
    useGetSpraysQuery,
    useGetSprayQuery,
    useGetSpraysForUserQuery,
    useLazyGetSpraysQuery
} = sprayApiSlice