export const typeDef = `#graphql
    type User {
        id: ID!,
        username: String!
        nickname: String!,
        avatar_url: String!,
        bio: String!,
        followings: Int!,
        followers: Int!,
    }
    type Follow {
        id: ID!,
        follower_id: ID!,
        followee_id: ID!,
        created_on: String!
    }
    type Query {
        user(id: ID!): User,
        followers(id: ID!, pagination: PaginationInput!): [User]
        followings(id: ID!, pagination: PaginationInput!): [User]
        follow(id: ID!, followeeId: ID!): Boolean
    }
    type Mutation {
        editUser(id: ID!, username: String, nickname: String, bio: String): User
        deleteUser(id: ID!): User
        follow(id: ID!, followeeId: ID!):  Follow
        unfollow(id: ID!, followeeId: ID!): Follow
    }
    input PaginationInput {
        page: Int!,
        count: Int!
    }
`