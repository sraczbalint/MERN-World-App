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

// static files
app.use(express.static('public'))

app.use('/api/pins', pinRouter)
app.use('/api/users', userRouter)

app.use(express.urlencoded({ extended: true }))

// new part of the
// app.use(express.static(path.join(__dirname, '/client/build')))
// app.get('/*', function (req, res) {
//  res.sendFile('path to index.html')
// })

// process.env.PORT || 8800

console.log('PORT', process.env.PORT)

const port = app.listen(process.env.PORT || 8800, '0.0.0.0', () => {
  console.log(`Backend is running on a port: ${port}!`)
})
