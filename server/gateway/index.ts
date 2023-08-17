import express from 'express'
import cors from 'cors'
import proxy from 'express-http-proxy'

const app = express()

const whitelist = ['http://localhost:5173'];
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
    if(whitelist.includes(origin as string))
        return callback(null, true)

        callback(new Error('Not allowed by CORS'))
    }
}))
app.use(express.json())

app.use('/auth', proxy('http://localhost:8001'))
app.use('/user', proxy('http://localhost:8002'))
app.use('/upload', proxy('http://localhost:8003'))
app.use('/notification', proxy('http://localhost:8004'))
//app.use('/auth', proxy('http://localhost:8001'))
//app.use('/auth', proxy('http://localhost:8001'))
//app.use('/auth', proxy('http://localhost:8001'))

app.listen(8000, () => {
    console.log('Gateway is listening to Port 8000')
})