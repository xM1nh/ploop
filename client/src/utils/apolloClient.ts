import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({
    uri: `http://localhost:8000/graphql`
})

const wsLink = new GraphQLWsLink(createClient({
    url: `ws://localhost:8000/graphql`
}))

const splitLink = split(
    ({query}) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink,
    httpLink
)

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    comments: {
                        keyArgs: false,
                        merge(existing, incoming, {args}) {
                            const {pagination: {count}} = args
                            const merged = existing ? existing.slice(count) : []
                            for (let i = 0; i < incoming.length; i ++) {
                                merged[count + i] = incoming[i]
                            }
                            return merged
                        }
                    }
                }
            }
        }
    })
})

export default client