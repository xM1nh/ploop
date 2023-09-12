export const typeDef = `#graphql
    type Like {
        id: ID!,
        spray: Spray!, #Reference Spray type from sprayTypeDef
        user: User! #Reference User type from userTypeDef
    }
    type Query {
        likes(sprayId: ID!, limit: Int!, offset: Int!): [Like]!,
        like(sprayId: ID!, userId: ID!): Like
    }
    type Mutation {
        like(sprayId: ID!, userId: ID!, notifierId: ID): Like
        unlike(sprayId: ID!, userId: ID!): Like
    }
`