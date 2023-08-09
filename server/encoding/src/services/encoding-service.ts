import GIFEnconder from 'gifencoder'
import ffmpeg from 'fluent-ffmpeg'
import { createCanvas, Image } from 'canvas';
import fsPromises from'fs/promises'
import path from 'path'
import { EncodingRepository } from '../database';

class EncodingService {
    repository = new EncodingRepository()

    async encode(id: string) {
        const canvas = createCanvas(450, 800)
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, 450, 800)

        const folderPath = `../file-storage/${id}/`
    
        const files = await fsPromises.readdir(folderPath)
        const imagePaths = files
            .sort((a, b) => {
                const numA = parseInt(a)
                const numB = parseInt(b)
                return numA - numB
            })
            .map(file => path.join(folderPath, file))
            
        const encoder = new GIFEnconder(450, 800)
        encoder.setRepeat(0);
        encoder.setDelay(24);
        encoder.setQuality(10);
        encoder.start();
    
        imagePaths.forEach((url: string, i: number) => {
            const image = new Image()
            image.onload = () => {
                ctx.drawImage(image, 0, 0)
                encoder.addFrame(ctx as any)
            }
            image.src = url
        })
        
        encoder.finish()

        const gifBuffer = encoder.out.getData()
        const sprayLocation = this.repository.upload(id, gifBuffer)
        return sprayLocation
    }

    async encodeVideo(id: string) {
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

        ffmpeg()
            .input(inputListPath)
            .inputOption(['-f concat', '-safe 0'])
            .inputFPS(60)
            .videoCodec('libx264')
            .size('1080x1920')
            .autopad()
            .output(outputPath)
            .on('error', (e) => {
                console.error(e);
            })
            .on('end', async () => {
                const videoFileContent = await fsPromises.readFile(outputPath)

                const sprayLocation = await this.repository.upload(id, videoFileContent)
                console.log(sprayLocation)
            })
            .run()
    }

    async subscribeEvents(payload: string) {
        const message = JSON.parse(payload)

        const {event, data} = message

        const {id} = data

        switch(event) {
            case 'PROCESS':
                this.encodeVideo(id)
                //this.encode(id)
                break
            default: 
                break
        }
    }
}

export default EncodingService