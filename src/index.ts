require('dotenv').config()
const express = require('express')

const app = express()

const PORT = process.env.PORT || 5000


const run = () => {
  try {
    app.listen(PORT,() => console.log(`Server has been started on ${PORT} port`))
  }
  catch (e){
    console.log(e)
  }
}
run()