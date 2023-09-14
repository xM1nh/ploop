import { PutObjectCommand } from '@aws-sdk/client-s3'
import {s3} from '..'
import { CLOUDFLARE_ACCOUNT_ID } from '../../config'

class EncodingRepository {
    async uploadVideo(id: string, body: Buffer) {
        const objectKey = `sprays/${id}`

        const command = new PutObjectCommand({
            Bucket: 'ploop',
            Key: objectKey,
            ContentType: 'video/mp4',
            Body: body
        })

        try {
            await s3.send(command)
            const objectLocation = `https://ploopapp.com/${objectKey}`

            return objectLocation
        } catch (e) {
            throw e
        }
    }

    async uploadCoverImage(id: string, body: Buffer) {
        const objectKey = `covers/${id}`

        const command = new PutObjectCommand({
            Bucket: 'ploop',
            Key: objectKey,
            ContentType: 'image/png',
            Body: body
        })

        try {
            await s3.send(command)
            const objectLocation = `https://ploopapp.com/${objectKey}`

            return objectLocation
        } catch (e) {
            throw e
        }
    }
}

export default EncodingRepository