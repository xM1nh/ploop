import {makeExecutableSchema} from '@graphql-tools/schema'

import { 
    sprayTypeDef, sprayResolvers, 
    commentTypeDef, commentResolvers,
    likeTypeDef, likeResolvers,
    saveTypeDef, saveResolvers  } from "./spray";
import { typeDef as userTypeDef, resolvers as userResolvers } from "./user";

const typeDefs = [
    userTypeDef,
    sprayTypeDef, 
    commentTypeDef,
    likeTypeDef,
    saveTypeDef
]
const resolvers = [ 
    userResolvers,
    sprayResolvers,
    commentResolvers,
    likeResolvers,
    saveResolvers
]

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})
