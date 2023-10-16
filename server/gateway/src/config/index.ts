import dotEnv from "dotenv";
import { CorsOptions } from "cors";

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}.local`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

const whitelist = ["http://localhost:5173", "https://studio.apollographql.com"];
export const corsOptions: CorsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin as string)) {
      return callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS`));
    }
  },
};

const index = {
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL as string,
};

export const { MESSAGE_BROKER_URL } = index;
