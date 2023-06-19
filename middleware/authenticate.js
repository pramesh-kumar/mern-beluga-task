const User = require('../model/userSchema')
const jwt = require('jsonwebtoken')

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken
    if (!token) {
      return res.status(401).json({ msg: 'Token not found' })
    }

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY)

    // console.log(verifyToken)

    const userData = await User.findOne({
      _id: verifyToken._id,
      'tokens.token': token,
    })

    // console.log(userData)

    if (!userData) {
      throw new console.error('User not found')
    }

    req.token = token
    req.UserID = userData._id
    req.userData = userData

    next()
  } catch (error) {
    console.log(error)
    res.status(401).send('UnAuthorized : No token provided')
  }
}

module.exports = authenticate
