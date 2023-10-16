import { Express } from "express";
import { Server } from "http";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { schema } from "../graphql/schema";
import {
  SpraySource,
  CommentSource,
  LikeSource,
  SaveSource,
} from "../graphql/spray";
import { UserSource } from "../graphql/user";
import { DataSource } from "../utils/types";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { DataSources } from "apollo-server-core/dist/graphqlOptions";
import { corsOptions } from "../config";
import { Connection } from "amqplib";
import { AMQPPubSub } from "graphql-amqp-subscriptions";

export default async (
  httpServer: Server,
  app: Express,
  connection: Connection,
) => {
  const dataSources = () => {
    return {
      userApi: new UserSource(),
      sprayApi: new SpraySource(),
      commentApi: new CommentSource(),
      likeApi: new LikeSource(),
      saveApi: new SaveSource(),
    } as DataSources<DataSource>;
  };

  const pubsub = new AMQPPubSub({
    connection,
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async () => {
        return {
          pubsub,
          dataSources: dataSources(),
        };
      },
    },
    wsServer,
  );

  const server = new ApolloServer({
    csrfPrevention: true,
    schema,
    context: async () => {
      return {
        pubsub,
        dataSources: dataSources(),
      };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  server.applyMiddleware({ app, cors: corsOptions });
};
