const express = require('express')
const router = express.Router()

// get means retrieving data from database using web
// post means posting data to database using web

require('../db/conn')

const User = require('../model/userSchema')

router.get('/', (req, res) => {
  res.send(`Hello Home from router server`)
})

// router.post('/register', (req, res) => {
//   // object destructing

//   // console.log(req.url)
//   // console.log(req.body)
//   // res.json({ mesage: req.body })

//   const { name, email, phone, work, password, cpassword } = req.body

//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({ error: 'Plz fill all details' })
//   }

//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: 'This email already used' })
//       }
//       // creating new instance of new user
//       const user = new User({ name, email, phone, work, password, cpassword })

//       // to save user input data in database
//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: 'User registered successfully' })
//         })
//         .catch((err) => {
//           res.status(500).json({ error: 'Failed to register' })
//         })
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// })

// using async await

router.post('/register', async (req, res) => {
  // object destructing

  const { name, email, phone, work, password, cpassword } = req.body

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: 'Plz fill all details' })
  }

  try {
    const userExist = await User.findOne({ email: email })
    if (userExist) {
      // console.log(userExist)
      return res.status(422).json({ error: 'This email already used' })
    }
    // creating new instance of new user
    const user = new User({ name, email, phone, work, password, cpassword })

    // to save user input data in database

    const userRegister = await user.save()
    if (userRegister) {
      console.log(userExist)
      res.status(201).json({ message: 'User registered successfully' })
    } else {
      res.status(500).json({ error: 'Failed to register' })
    }
  } catch (error) {
    console.log(error)
  }
})

// login route

router.post('/signin', async (req, res) => {
  // object destructing

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(422).json({ error: 'Plz fill all details' })
  }

  try {
    const userExist = await User.findOne({ email: email })
    if (userExist) {
      console.log(userExist)
      return res.status(201).json({ message: 'Signin  successfully' })
    } else {
      return res.status(422).json({ error: 'Invalid credentials' })
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
