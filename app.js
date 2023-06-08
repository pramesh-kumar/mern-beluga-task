const dotenv = require('dotenv')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// below line one time writing enough because we told to app.js
dotenv.config({ path: './config.env' })
// database connection
require('./db/conn')

const PORT = process.env.PORT

// Middleware
const middleware = (req, res, next) => {
  console.log(`This is middleware`)
  next()
}

// middleware()

app.get('/', (req, res) => {
  res.send(`Hello Home from server`)
})
app.get('/about', middleware, (req, res) => {
  res.send(`Hello About`)
})
app.get('/contact', (req, res) => {
  res.send(`Hello Contact`)
})
app.get('/signin', (req, res) => {
  res.send(`Hello login`)
})
app.get('/signup', (req, res) => {
  res.send(`Hello Signup`)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
