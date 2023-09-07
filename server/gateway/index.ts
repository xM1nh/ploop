import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs, resolvers } from './src/graphql/schema'

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    })
    
    const { url } = await startStandaloneServer(server, {
        listen: { port: 8000 }
    })
    
    console.log(`Server ready at ${url}`)
}

startServer()

// import express from 'express'
// import cors from 'cors'
// import { createProxyMiddleware } from 'http-proxy-middleware'

// const app = express()

// const whitelist = ['http://localhost:5173'];
// app.use(cors({
//     credentials: true,
//     origin: (origin, callback) => {
//     if(whitelist.includes(origin as string))
//         return callback(null, true)

//         callback(new Error('Not allowed by CORS'))
//     }
// }))

// app.use('/auth', 
//     createProxyMiddleware({
//         target: 'http://localhost:8001', 
//         pathRewrite: {'/auth': '/'}
//     })
// )
// app.use('/user',
//     createProxyMiddleware({
//         target: 'http://localhost:8002', 
//         pathRewrite: {'/user': '/'}
//     })
// )
// app.use('/upload',
//     createProxyMiddleware({
//         target: 'http://localhost:8003', 
//         pathRewrite: {'/upload': '/'}
//     })
// )
// app.use(
//     createProxyMiddleware('/notification', {
//         target: 'http://localhost:8004',
//         ws: true,
//         pathRewrite: {'/notification': '/'}
//     })
// )
// app.use(
//     createProxyMiddleware('/sprays', {
//         target: 'http://localhost:8005',
//         ws: true,
//     })
// )

// app.use(
//     createProxyMiddleware('/likes', {
//         target: 'http://localhost:8005',
//         ws: true,
//     })
// )

// app.listen(8000, () => {
//     console.log('Gateway is listening to Port 8000')
// })