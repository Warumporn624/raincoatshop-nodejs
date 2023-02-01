const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { readdirSync } = require('fs')
require('dotenv').config();
const connectDB = require('./config/db')

const app = express()

// connect database
connectDB();

// Middleware
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '20mb' }))
app.use(cors())

// Route
readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)))


const port = process.env.PORT
app.listen(port, () => {
    console.log('Server is running on port' + port)
})
