export const typeDef = `#graphql
    union Entity = User | Spray | Comment
    type Notification {
        id: ID!,
        actor: User,
        notifier: User!,
        entity: Entity!,
        created_on: String!,
        status: Int!
    }
    type Query {
        notifications(userId: ID!, pagination: PaginationInput!): [Notification!]
    }
    type Mutation {
        read(id: ID!): Notification!
        unread(id: ID!): Notification!
    }
`