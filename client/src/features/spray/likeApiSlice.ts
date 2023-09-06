import apiSlice from "../../app/api/apiSlice"

const likeApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getLikes: builder.query({
            query: ({id, page, count}) => `/likes/${id}?page=${page}&count=${count}`
        }),
        getLike: builder.query({
            query: ({sprayId, userId}) => `/likes/like/isLike?sprayId=${sprayId}&userId=${userId}`
        }),
        like: builder.mutation({
            query: ({id, actorId, notifierId}) => ({
                url: `/likes/${id}`,
                method: 'POST',
                body: {actorId, notifierId}
            })
        }),
        unlike: builder.mutation({
            query: ({id, actorId}) => ({
                url: `/likes/${id}`,
                method: 'DELETE',
                body: {actorId}
            })
        })
    })
})

export const {
    useGetLikesQuery,
    useGetLikeQuery,
    useLazyGetLikeQuery,
    useLikeMutation,
    useUnlikeMutation
} = likeApiSlice