require('dotenv').config()
import express from 'express'
import cors from 'cors'
import {DBService} from './services/db';
import cookieParser from 'cookie-parser'
import router from './routes'
import errorMiddleware from './middlewares/error-middleware'
import bodyParser from 'body-parser'

const app = express()


app.use(cors({
	credentials: true,
	origin: process.env.CLIENT_URL,
}))
app.use(express.static('uploads'));
app.use(bodyParser())
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

const PORT = +(process.env.PORT || 5000)

const run = () => {
	try {
		DBService.postgres.start()
		
		app.listen(PORT, () => console.log(`Server has been started on ${PORT} port`))
	}
	catch (e) {
		console.log(e)
	}
}
run()