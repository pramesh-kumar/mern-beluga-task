const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// get means retrieving data from database using web
// post means posting data to database using web

// require('../db/conn')
const User = require('../model/userSchema')

const authenticate = require('../middleware/authenticate')

// using promises

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
    } else if (password != cpassword) {
      return res
        .status(422)
        .json({ error: 'Password and confirm password not match' })
    } else {
      // creating new instance (object) of new user
      const user = new User({ name, email, phone, work, password, cpassword })

      // before save data to db we have to hash the password in userSchema

      // to save user input data in database

      const userRegister = await user.save()

      if (userRegister) {
        // console.log(userExist)
        res.status(201).json({ message: 'User registered successfully' })
      } else {
        res.status(500).json({ error: 'Failed to register' })
      }
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
    return res.status(422).json({ error: 'Plz fill all details !' })
  }

  try {
    const userExist = await User.findOne({ email: email })

    if (userExist) {
      // console.log(userExist)

      const isMatch = await bcrypt.compare(password, userExist.password)

      // generating toekn
      const token = await userExist.generateAuthToken()
      console.log(token)

      // storing to cookie
      res.cookie('jwtoken', token, {
        //  from now to 30 days later cookie will expire
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      })

      if (!isMatch) {
        return res.status(422).json({ message: 'Password incorrect' })
      } else {
        return res.status(201).json({ message: 'Signin  successfully' })
      }
    } else {
      return res.status(422).json({ error: 'Invalid credentials' })
    }
  } catch (error) {
    console.log(error)
  }
})

router.get('/about', authenticate, (req, res) => {
  // console.log(`About Page called !`)
  // res send to About.jsx in client component of frontend
  res.send(req.userData)
})

// get user data for contact and home page

router.get('/getData', authenticate, (req, res) => {
  res.send(req.userData)
})

// contact data

router.post('/contact', authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    if (!name || !email || !phone || !message) {
      return res.status(422).json({ error: 'Plz fill all details' })
    }

    const userContact = await User.findOne({ _id: req.UserID })

    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message,
      )
      // console.log(userMessage)
      // console.log(userContact)

      await userContact.save()

      res.status(201).json({ message: 'User contact done successfully !! ' })
    }
  } catch (error) {
    console.log(error)
  }
})

// logout page
router.get('/logout', (req, res) => {
  res.clearCookie('jwtoken', { path: '/' })
  res.status(200).send('user logout')
})

module.exports = router
