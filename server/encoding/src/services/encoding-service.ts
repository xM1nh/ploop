import GIFEnconder from 'gifencoder'
import { createCanvas, Image } from 'canvas';
import fsPromises from'fs/promises'
import fs from 'fs'
import path from 'path'
import cluster from 'cluster';

class EncodingService {
    async encode(id: string) {
        const workerId = cluster.worker?.id
        console.log(workerId)
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
        encoder.createReadStream().pipe(fs.createWriteStream(`./src/output/${id}.gif`));
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
    }
}

export default EncodingService