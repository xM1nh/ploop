import express, {Express} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { auth } from '../api'
import { corsOptions } from '../config'

export default (app :Express) => {

    app.use(express.json())
    app.use(cors(corsOptions))
    app.use(express.static(__dirname + '/public'))
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    auth(app)
}