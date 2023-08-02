import express, {Express} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

export default (app :Express) => {

    app.use(express.json())
    //app.user(cors())
    app.use(express.static(__dirname + '/public'))
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())
}