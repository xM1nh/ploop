import express from 'express';
const app = express();
const port = 3000;

import fs from 'fs'
import path from 'path'

import GIFEnconder from 'gifencoder'
import { createCanvas, Image } from 'canvas';

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/generate-gif', (req, res) => {
    const canvas = createCanvas(450, 800)
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 450, 800)

    const response = fs.readFileSync(path.resolve(__dirname, 'test.json'), { encoding: 'utf8'})
    const dataUrl :string[][] = JSON.parse(response)

    const encoder = new GIFEnconder(450, 800)
    encoder.createReadStream().pipe(fs.createWriteStream('./src/output/result2.gif'));
    encoder.setRepeat(0);
    encoder.setDelay(24);
    encoder.setQuality(10);
    encoder.start();

    dataUrl.forEach(async (step: string[], i :number) => {
        step.forEach(async (url: string, j: number) => {
        const image = new Image()
        image.onload = () => {
            ctx.drawImage(image, 0, 0)
            encoder.addFrame(ctx as any)
        }
        image.src = url
        })
    })

    encoder.finish()
    console.log('complete')
    res.status(200).json('complete')
})

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
    