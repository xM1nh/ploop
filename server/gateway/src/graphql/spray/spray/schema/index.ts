export const typeDef = `#graphql
    type Spray {
        id: ID!,
        url: String!,
        cover_url: String!,
        created_on: String!,
        user: User!, #Reference the User type from userTypeDef
        caption: String!,
        likes: Int!,
        edits: Int!,
        comments: Int!,
        saves: Int!,
        shares: Int!,
        view_permission: Int!,
        draw_permission: Int!,
        limited: Boolean!,
        deadline: String!,
        original_id: Int,
        isLike: Like,
        isSave: Save,
    }
    type Query {
        sprays(pagination: PaginationInput!): [Spray!],
        resprays(id: ID!, pagination: PaginationInput): [Spray]!
        userSprays(userId: ID!, pagination: PaginationInput!): [Spray]!,
        userResprays(userId: ID!, pagination: PaginationInput!): [Spray]!,
        spray(id: ID!): Spray!,
    }
    type Mutation {
        deleteSpray(id: ID!): Spray!,
        editSpray(
            id: ID!, 
            caption: String, 
            viewPermission: Int, 
            drawPermission: Int, 
            limited: Boolean, 
            deadline: String
        ): Spray!,

    }
`