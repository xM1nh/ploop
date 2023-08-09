import dotEnv from 'dotenv';
import { CorsOptions } from 'cors'

//.env
if (process.env.NODE_ENV !== 'prod') {
    const configFile = `./.env.${process.env.NODE_ENV}.local`
    dotEnv.config({path: configFile})
} else {
    dotEnv.config()
}

//Cors
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
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    EXCHANGE_NAME: 'PLOOP_EVENT_BUS',
    PROCESSING_ROUTING_KEY: 'PROCESSING_SERVICE',
    QUEUE_NAME: 'PROCESSING_QUEUE',
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY as string,
    AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
}

export const {
    PORT,
    MESSAGE_BROKER_URL,
    EXCHANGE_NAME,
    PROCESSING_ROUTING_KEY,
    QUEUE_NAME,
    AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_ACCESS_KEY
} = index