import _ from 'lodash'

import { typeDef as sprayTypeDef } from "./spray";
import { typeDef as userTypeDef } from "./user";

import { resolvers as sprayResolvers } from './spray';
import { resolvers as userResolvers } from './user';

export const typeDefs = [
    sprayTypeDef, 
    userTypeDef
]
export const resolvers = _.merge({}, 
    sprayResolvers, 
    userResolvers
)