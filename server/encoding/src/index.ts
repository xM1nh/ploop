import express from 'express'
import {PORT} from './config/index'
import expressApp from './utils/express-app'
import { connect } from './utils'
import cluster from 'cluster'
import os from 'os'

const StartServer = async () => {
    const app = express()

    const channel = await connect()

    expressApp(app, channel)

    app.listen(PORT, () => {
        console.log(`Encoding is listening to Port 8001`)

    })
    
    /*const numCPUs = os.cpus().length
    
    if (cluster.isPrimary) {
        for (let i = 0; i < numCPUs/2; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`)
            cluster.fork()
        })
    } else {
        const workerId = cluster.worker?.id

        app.listen(PORT, () => {
            console.log(`Upload worker ${workerId} is listening to Port 8001`)
        })
    }*/
}

StartServer()