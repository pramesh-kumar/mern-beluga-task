const express = require('express')
const router = express.Router()

// get means retrieving data from database using web
// post means posting data to database using web

require('../db/conn')

const User = require('../model/userSchema')

router.get('/', (req, res) => {
  res.send(`Hello Home from router server`)
})

router.post('/register', (req, res) => {
  // object destructing

  // console.log(req.url)
  // console.log(req.body)
  // res.json({ mesage: req.body })

  const { name, email, phone, work, password, cpassword } = req.body

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: 'Plz fill all details' })
  }

  User.findOne({ email: email })
    .then((userExist) => {
      if (userExist) {
        return res.status(422).json({ error: 'This email already used' })
      }
      // creating new instance of new user
      const user = new User({ name, email, phone, work, password, cpassword })

      // to save user input data in database
      user
        .save()
        .then(() => {
          res.status(201).json({ message: 'User registered successfully' })
        })
        .catch((err) => {
          res.status(500).json({ error: 'Failed to register' })
        })
    })
    .catch((err) => {
      console.log(err)
    })
})

module.exports = router
