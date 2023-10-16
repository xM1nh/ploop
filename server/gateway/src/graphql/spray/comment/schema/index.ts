export const typeDef = `#graphql
    type Comment {
        id: ID!,
        spray: Spray!, #Reference the Spray type from sprayTypeDef
        user: User!, #Reference the User type from userTypeDef
        created_on: String!,
        likes: Int!,
        description: String!,
    }
    type Query {
        comments(sprayId: ID!, pagination: PaginationInput!): [Comment!]
        comment(commentId: ID!): Comment!
    }
    type Mutation {
        addComment(sprayId: ID!, userId: ID!, notifierId: ID!, comment: String!): Comment!,
        editComment(commentId: ID!, newComment: String!): Comment!,
        deleteComment(commentId: ID!, sprayId: String!): Comment!
    }
    type Subscription {
        commentAdded(sprayId: ID!, userId: ID!): Comment
    }
`;
