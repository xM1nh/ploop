import dotEnv from 'dotenv';
import multer from 'multer'
import multerS3 from 'multer-s3'
import {Request} from 'express'
import { CorsOptions } from 'cors';
import { DeleteObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';

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

//R2
export const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: CLOUDFLARE_R2_ACCESS_KEY,
        secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY
    }
})

//Multer
export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'ploop',
        key: async function(req: Request, file, cb) {
            const id = file.originalname
            try {
                const key = `user-avatar/${id}.png`

                const headObject = new HeadObjectCommand({
                    Bucket: 'ploop',
                    Key: key
                })
                await s3.send(headObject)

                const deleteObject = new DeleteObjectCommand({
                    Bucket: 'ploop',
                    Key: key
                })
                await s3.send(deleteObject)
            } catch(e) {
                console.log('File does not exist or could not be deleted:', e)
            }
            
            cb(null, id)
        }
    })
})