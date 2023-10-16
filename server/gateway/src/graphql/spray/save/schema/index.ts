export const typeDef = `#graphql
    type Save {
        id: ID!,
        spray: Spray!, #Reference Spray type from sprayTypeDef
        user: User! #Reference User type from userTypeDef
        created_on: String!
    }
    type Query {
        saves: [Save]!,
        save(sprayId: ID!, userId: ID!): Save!
    }
    type Mutation {
        save(sprayId: ID!, userId: ID!): Save!,
        unsave(sprayId: ID!, userId: ID!): Save! 
    }
`;
