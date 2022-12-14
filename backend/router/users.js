const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

// register

router.post('/register', async (req, res) => {
  try {
    // generate new password

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //  check if user is already exist.

    const validUser = await User.findOne({ username: req.body.username })
    if (validUser) {
      // create new user

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      })

      // save user and send response

      const user = await newUser.save()
      res.status(200).json(user._id)
    } else {
      // if username is already in use
      res.status(400).json('Username is already in use')
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

// login

router.post('/login', async (req, res) => {
  try {
    // find user
    const user = await User.findOne({ username: req.body.username })
    if (!user) res.status(400).json('Wrong username or password!')

    // validate password

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) res.status(400).json('Wrong username or password!')

    // send res
    res.status(200).json({ _id: user._id, username: user.username })
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
