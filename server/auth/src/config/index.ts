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
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET
} = index