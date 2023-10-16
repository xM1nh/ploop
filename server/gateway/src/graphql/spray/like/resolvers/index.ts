import { Like, DataSource, Pagination } from "../../../../utils/types";

export const resolvers = {
  Query: {
    likes: async (
      _: any,
      { sprayId, pagination }: { sprayId: string; pagination: Pagination },
      { dataSources }: { dataSources: DataSource },
    ) => {
      const { page, count } = pagination;
      return dataSources.likeApi.getLikes(sprayId, page, count);
    },
    like: async (
      _: any,
      { sprayId, userId }: { sprayId: string; userId: string },
      { dataSources }: { dataSources: DataSource },
    ) => {
      return dataSources.likeApi.getLike(sprayId, userId);
    },
  },
  Mutation: {
    like: async (
      _: any,
      args: { sprayId: string; userId: string; notifierId: string },
      { dataSources }: { dataSources: DataSource },
    ) => {
      const { sprayId, userId, notifierId } = args;
      return dataSources.likeApi.like(sprayId, userId, notifierId);
    },
    unlike: async (
      _: any,
      { sprayId, userId }: { sprayId: string; userId: string },
      { dataSources }: { dataSources: DataSource },
    ) => {
      return dataSources.likeApi.unlike(sprayId, userId);
    },
  },
  Like: {
    spray: async (
      parent: Like,
      _: any,
      { dataSources }: { dataSources: DataSource },
    ) => {
      return dataSources.sprayApi.getSpray(parent.spray_id.toString());
    },
    user: async (
      parent: Like,
      _: any,
      { dataSources }: { dataSources: DataSource },
    ) => {
      return dataSources.userApi.getUser(parent.user_id.toString());
    },
  },
};
