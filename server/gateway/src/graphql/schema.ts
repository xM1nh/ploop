import _ from 'lodash'

import { 
    sprayTypeDef, sprayResolvers, 
    commentTypeDef, commentResolvers,
    likeTypeDef, likeResolvers,
    saveTypeDef, saveResolvers  } from "./spray";
import { userTypeDef, userResolvers } from "./user";


export const typeDefs = [
    userTypeDef,
    sprayTypeDef, 
    commentTypeDef,
    likeTypeDef,
    saveTypeDef
]
export const resolvers = _.merge({}, 
    userResolvers,
    sprayResolvers,
    commentResolvers,
    likeResolvers,
    saveResolvers
)