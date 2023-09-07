import dotEnv from 'dotenv';
import { CorsOptions } from 'cors';

if (process.env.NODE_ENV !== 'prod') {
    const configFile = `./.env.${process.env.NODE_ENV}.local`
    dotEnv.config({path: configFile})
} else {
    dotEnv.config()
}

//Cors
const whitelist = ['http://localhost:5173', 'http://localhost:8000'];
export const corsOptions: CorsOptions = {
    credentials: true,
    origin: (origin, cb) => {
    if(whitelist.includes(origin as string))
        return cb(null, true)

        cb(new Error('Not allowed by CORS'))
    }
}


const index = {
    PORT: process.env.PORT,
    DB_USER: process.env.POSTGRES_USER,
    DB_HOST: process.env.POSTGRES_HOST,
    DB_PASSWORD: process.env.POSTGRES_PASSWORD,
    DB_NAME: process.env.POSTGRES_DB,
    DB_PORT: process.env.POSTGRES_PORT,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL as string,
    EXCHANGE_NAME: 'PLOOP_EVENT_BUS',
    AUTH_QUEUE: 'AUTH_QUEUE',
    AUTH_ROUTING_KEY: 'AUTH_SERVICE',
    USER_QUEUE: 'USER_QUEUE',
    USER_ROUTING_KEY: 'USER_SERVICE',
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_R2_ACCESS_KEY: process.env.CLOUDFLARE_R2_ACCESS_KEY as string,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY as string,
    DEFAULT_AVATAR_URL: process.env.DEFAULT_AVATAR_URL as string
}

export const {
    PORT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
    MESSAGE_BROKER_URL,
    EXCHANGE_NAME,
    USER_ROUTING_KEY,
    USER_QUEUE,
    AUTH_QUEUE,
    AUTH_ROUTING_KEY,
    CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_R2_ACCESS_KEY,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    DEFAULT_AVATAR_URL
} = index