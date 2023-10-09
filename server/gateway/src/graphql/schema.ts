import {makeExecutableSchema} from '@graphql-tools/schema'

import { 
    sprayTypeDef, sprayResolvers, 
    commentTypeDef, commentResolvers,
    likeTypeDef, likeResolvers,
    saveTypeDef, saveResolvers  } from "./spray";
import { typeDef as userTypeDef, resolvers as userResolvers } from "./user";
import { typeDef as notificationTypeDef, resolvers as notificationResolvers } from './notification';

const typeDefs = [
    userTypeDef,
    sprayTypeDef, 
    commentTypeDef,
    likeTypeDef,
    saveTypeDef,
    notificationTypeDef
]
const resolvers = [ 
    userResolvers,
    sprayResolvers,
    commentResolvers,
    likeResolvers,
    saveResolvers,
    notificationResolvers
]

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})
