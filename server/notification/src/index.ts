import express from 'express'
import {PORT} from './config/index'
import expressApp from './utils/express-app'

const StartServer = async () => {
    const app = express()

    expressApp(app)

    app.listen(PORT, () => {
        console.log('User is listening to Port 8001')
    })
}

StartServer()