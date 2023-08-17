import {
    DB_HOST, 
    DB_NAME, 
    DB_PASSWORD, 
    DB_PORT, 
    DB_USER,    
} from '../config'

import {Pool} from 'pg'
import {S3Client} from '@aws-sdk/client-s3'

/*AWS.config.update({
    accessKeyId: AWS_S3_ACCESS_KEY,
    secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
    region: 'us-west-1'
})
const s3 = new AWS.S3({})*/

export const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: parseInt(DB_PORT as string)
})