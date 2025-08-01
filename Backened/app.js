import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRouter.js'
import requestRouter from './routes/requestRouter.js'
import workRouter from './routes/workRouter.js'
import adminRouter from './routes/adminRouter.js'
import fileUpload from 'express-fileupload'
import { dbConnection } from './database/dbConnection.js'
import { errorMiddleware } from './middlewares/error.js'

const app = express()
dotenv.config({path: './config/config.env'})


app.use(cors({
    origin: 'https://labourease.netlify.app',
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

app.use('/api/user', userRouter)
app.use('/api/request', requestRouter)
app.use('/api/work', workRouter)
app.use('/api/admin/', adminRouter)

dbConnection()

app.use(errorMiddleware)

export default app