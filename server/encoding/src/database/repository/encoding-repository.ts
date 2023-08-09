import {s3} from '..'
import { ManagedUpload } from 'aws-sdk/clients/s3'

class EncodingRepository {
    async upload(id: string, body: Buffer) {
        const params = {
            Bucket: 'ploop-blob-storage',
            Key: `sprays-encoded/${id}.mp4`,
            Body: body,
            ContentType: 'video/mp4'
        }

        try {
            const data = await s3.upload(params).promise()
            return data.Location
        } catch (e) {
            return null
        }
    }
}

export default EncodingRepository