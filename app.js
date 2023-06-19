const dotenv = require('dotenv')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

// below line one time writing enough because we told to app.js
dotenv.config({ path: './config.env' })
// database connection
require('./db/conn')

// this is used bcz of to send cookie from frontend to backend
app.use(cookieParser())

const PORT = process.env.PORT
// middleware to read json data by my application
app.use(express.json())

// const User = require('./model/userSchema')

// app.get('/', (req, res) => {
//   res.send(`Hello Home from router server`)
// })

// middleware -> we link the router files to make route is easy
app.use('/api', require('./router/auth'))

// Middleware

// const middleware = (req, res, next) => {
//   console.log(`This is middleware`)
//   next()
// }

// middleware() // fxn call

// app.get('/', (req, res) => {
//   res.send(`Hello Home from server from app.js`)
// })

// app.get('/about', middleware, (req, res) => {
//   res.send(`Hello About`)
// })

// app.get('/contact', (req, res) => {
//   // res.cookie('testCookie', 'pramesh')
//   res.send(`Hello Contact`)
// })
// app.get('/signin', (req, res) => {
//   res.send(`Hello login`)
// })
// app.get('/signup', (req, res) => {
//   res.send(`Hello Signup`)
// })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
