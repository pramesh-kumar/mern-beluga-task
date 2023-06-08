const mongoose = require('mongoose')
const DB = process.env.DATABASE

mongoose
  .connect(DB)
  .then(() => {
    console.log('connected to db')
  })
  .catch((err) => {
    console.log(`Connection failed`)
  })
