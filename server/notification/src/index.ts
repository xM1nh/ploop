import express from 'express'
import {PORT} from './config/index'
import { connect } from './utils'
import expressApp from './utils/express-app'

const StartServer = async () => {
    const app = express()

    const channel = await connect()

    expressApp(app, channel)

    app.listen(PORT, () => {
        console.log('Notification is listening to Port 8001')
    })
}

StartServer()