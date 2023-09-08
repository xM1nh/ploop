import _ from 'lodash'

import { sprayTypeDef, sprayResolvers } from "./spray";
import { userTypeDef, userResolvers } from "./user";
import { commentTypeDef, commentResolvers } from './spray';


export const typeDefs = [
    userTypeDef,
    sprayTypeDef, 
    commentTypeDef
]
export const resolvers = _.merge({}, 
    userResolvers,
    sprayResolvers,
    commentResolvers
)