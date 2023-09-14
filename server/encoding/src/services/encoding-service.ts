import ffmpeg from 'fluent-ffmpeg'
import fsPromises from'fs/promises'
import path from 'path'
import { EncodingRepository } from '../database';
import { Channel } from 'amqplib';
import { publishMessage } from '../utils';
import { SPRAY_ROUTING_KEY } from '../config';

class EncodingService {
    repository: EncodingRepository
    channel

    constructor(channel: Channel) {
        this.repository = new EncodingRepository()
        this.channel = channel
    }

    async encode(id: string): Promise<{sprayUrl: string, coverUrl: string}> {
        const folderPath = `${process.cwd()}/../temp/${id}/`
        const outputPath = `${process.cwd()}/../temp/${id}/${id}.mp4`
        const inputListPath = `${process.cwd()}/../temp/${id}/${id}.txt`

        const files = await fsPromises.readdir(folderPath)
        const imagePaths = files
            .sort((a, b) => {
                const numA = parseInt(a)
                const numB = parseInt(b)
                return numA - numB
            })
            .map(file => path.join(folderPath, file))

        const imageInputString = imagePaths.map(file => {
            return `file '${file}'`
        }).join('\n')

        await fsPromises.writeFile(inputListPath, imageInputString)

        return new Promise((resolve, reject) => {
            ffmpeg()
                .input(inputListPath)
                .inputOption(['-f concat', '-safe 0'])
                .inputFPS(60)
                .videoCodec('libx264')
                .size('1080x1920')
                .autopad()
                .outputOption('-pix_fmt yuv420p')
                .output(outputPath)
                .on('error', (e) => {
                    console.error(e);
                    reject(e)
                })
                .on('end', async () => {
                    const videoFileContent = await fsPromises.readFile(outputPath)
                    const coverImageFileContent = await fsPromises.readFile(imagePaths[imagePaths.length - 1])

                    const sprayUrl = await this.repository.uploadVideo(id, videoFileContent)
                    const coverUrl = await this.repository.uploadCoverImage(id, coverImageFileContent)

                    await fsPromises.rm(folderPath, {recursive: true, force: true})

                    resolve({sprayUrl, coverUrl})
                })
                .run()
        })
    }

    async subscribeEvents(payload: string) {
        const message = JSON.parse(payload)

        const {event, data} = message

        const {id, ...rest} = data

        switch(event) {
            case 'PROCESS':
                const urls = await this.encode(id)
                const sprayMessage = {
                    event: 'CREATE_SPRAY',
                    data: {
                        ...urls,
                        ...rest
                    }
                }
                publishMessage(this.channel, SPRAY_ROUTING_KEY, sprayMessage)
                break
            default: 
                break
        }
    }
}

export default EncodingService