import dotEnv from 'dotenv';
import { CorsOptions } from 'cors'
import multer from 'multer'
import fs from 'fs'

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

//Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const folderName = req.headers['x-upload-id']
        const destination = `../temp/${folderName}`

        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, {recursive: true})
        }
        cb(null, destination)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
export const upload = multer({storage})

const index = {
    PORT: process.env.PORT,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    EXCHANGE_NAME: 'PLOOP_EVENT_BUS',
    PROCESSING_ROUTING_KEY: 'PROCESSING_SERVICE',
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY as string,
    AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
}

export const {
    PORT,
    MESSAGE_BROKER_URL,
    EXCHANGE_NAME,
    PROCESSING_ROUTING_KEY,
    AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_ACCESS_KEY
} = index