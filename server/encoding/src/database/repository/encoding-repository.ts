import { PutObjectCommand } from '@aws-sdk/client-s3'
import {s3} from '..'
import { CLOUDFLARE_ACCOUNT_ID } from '../../config'

class EncodingRepository {
    async upload(id: string, body: Buffer) {
        const objectKey = `sprays/${id}`

        const command = new PutObjectCommand({
            Bucket: 'ploop',
            Key: objectKey,
            ContentType: 'video/mp4',
            Body: body
        })

        try {
            await s3.send(command)
            const objectLocation = `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/ploop/${objectKey}`

            return objectLocation
        } catch (e) {
            return null
        }
    }
}

export default EncodingRepository