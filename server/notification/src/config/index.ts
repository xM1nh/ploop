import dotEnv from "dotenv";
import { CorsOptions } from "cors";

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}.local`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

//Cors
const whitelist = ["http://localhost:5173"];
export const corsOptions: CorsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin as string)) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
};

const index = {
  PORT: process.env.PORT,
  DB_USER: process.env.POSTGRES_USER,
  DB_HOST: process.env.POSTGRES_HOST,
  DB_PASSWORD: process.env.POSTGRES_PASSWORD,
  DB_NAME: process.env.POSTGRES_DB,
  DB_PORT: process.env.POSTGRES_PORT,
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME: "PLOOP_EVENT_BUS",
  NOTIFICATION_ROUTING_KEY: "NOTIFICATION_SERVICE",
  QUEUE_NAME: "NOTIFICATION_QUEUE",
};

export const {
  PORT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  NOTIFICATION_ROUTING_KEY,
  QUEUE_NAME,
} = index;
