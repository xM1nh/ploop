import dotEnv from 'dotenv';
import {CorsOptions} from 'cors'

if (process.env.NODE_ENV !== 'prod') {
    const configFile = `./.env.${process.env.NODE_ENV}.local`
    dotEnv.config({path: configFile})
} else {
    dotEnv.config()
}

const whitelist = ['http://localhost:5173'];
export const corsOptions: CorsOptions = {
    credentials: true,
    origin: (origin, callback) => {
    if(whitelist.includes(origin as string))
        return callback(null, true)

        callback(new Error('Not allowed by CORS'))
    }
}

const index = {
    PORT: process.env.PORT,
    DB_USER: process.env.POSTGRES_USER,
    DB_HOST: process.env.POSTGRES_HOST,
    DB_PASSWORD: process.env.POSTGRES_PASSWORD,
    DB_NAME: process.env.POSTGRES_DB,
    DB_PORT: process.env.POSTGRES_PORT,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    EXCHANGE_NAME: 'PLOOP_EVENT_BUS',
    USER_ROUTING_KEY: 'USER_SERVICE',
    QUEUE_NAME: 'USER_QUEUE',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET
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
    QUEUE_NAME,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET
} = index