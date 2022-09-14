const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const pinRouter = require('./router/pins')
const userRouter = require('./router/users')

const app = express()

const corsOpts = {
  origin: '*',

  methods: ['GET', 'POST'],

  allowedHeaders: ['Content-Type'],
}

app.use(cors(corsOpts))
app.use(express.json())

dotenv.config()

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB is connected')
  })
  .catch((err) => console.log(err))

app.use('/api/pins', pinRouter)
app.use('/api/users', userRouter)

app.listen(8800, () => {
  console.log('Backend is running! ')
})
