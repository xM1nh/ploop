export const typeDef = `#graphql
    union Entity = User | Spray
    type Notification {
        id: ID!,
        actor: User,
        notifier: User!,
        entity_type_id: ID!,
        entity: Entity!,
        created_on: String!,
        status: Int!
    }
    type Query {
        notifications(userId: ID!, pagination: PaginationInput!): [Notification!]
        unreadNotificationsCount(userId: ID!): Int!
    }
    type Mutation {
        read(id: ID!): Notification!
        unread(id: ID!): Notification!
        readAll(userId: ID!): String
        unreadAll(userId: ID!): String
    }
    type Subscription {
        notificationAdded(userId: ID!): Notification!
    }
`;
