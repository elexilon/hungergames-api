const router = require('express').Router()
const { User } = require('../models')
const passport = require('../config/auth')

router.post('/users', (req, res, next) => {
  User.register(new User({userType: req.body.userType, email: req.body.email, name: req.body.name}), req.body.password, (err, user) => {
    if (err) {
      err.status = 422
      return next(err)
    }

    const { userType, email, _id, createdAt, updatedAt, name } = user
    res.status(201).send({ userType, email, _id, createdAt, updatedAt, name })
  })
})

router.get('/users/me', passport.authorize('jwt', { session: false }), (req, res, next) => {
  if (!req.account) {
    const error = new Error('Unauthorized')
    error.status = 401
    next(error)
  }

  res.json(req.account)
})

module.exports = router
