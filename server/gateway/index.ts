import http from 'http'
import express from 'express'
import expressApp from './src/utils/express-app'
import apolloServer from './src/utils/apollo-server'
import { connect } from './src/utils'

const startServer = async () => {
    const app = express()
    const httpServer = http.createServer(app)
    const connection = await connect()

    apolloServer(httpServer, app, connection)
    expressApp(app)

    await new Promise<void>((resolve) => httpServer.listen({ port: 8000 }, resolve))
    console.log(`Server ready at http://localhost:8000`)
}

startServer()