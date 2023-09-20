require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { DBService } = require('./services/db');
const cookieParser = require('cookie-parser')
const { models } = require('./models')
const router = require('./routes')
const errorMiddleware = require('./middlewares/error-middleware')

const app = express()

app.use(cors({
	credentials: true,
	origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

const PORT = +process.env.PORT || 5000

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
export { }