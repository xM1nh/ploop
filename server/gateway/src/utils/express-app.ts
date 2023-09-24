import {Express} from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

export default (app: Express) => {
    app.use('/auth', 
    createProxyMiddleware({
        target: 'http://localhost:8001', 
        pathRewrite: {'/auth': '/'}
    })
)

    app.use('/upload',
        createProxyMiddleware({
            target: 'http://localhost:8003', 
            pathRewrite: {'/upload': '/'}
        })
)
}