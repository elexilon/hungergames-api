const router = require('express').Router()
const { Game } = require('../models')
const passport = require('../config/auth')

const authenticate = passport.authorize('jwt', { session: false })

router
  .get('/games', authenticate, (req, res, next) => {
    const id = req.account._id
    Game.find({'players.userId': {$gte: id} })
      .then(game => {
        if (!game) {
          const error = new Error('Creator profile not found!!')
          error.status = 404
          return next(error)
        }
        res.json(game)
      })
      .catch(error => next(error))
  })
  .get('/games/:id', authenticate, (req, res, next) => {
    const id = req.account._id
    Game.findById(req.params.id)
      .then(game => {
        if (!game) {
          const error = new Error('Creator profile not found!!')
          error.status = 404
          return next(error)
        }
        res.json(game)
      })
      .catch(error => next(error))
  })
  .post('/games', authenticate, (req, res, next) => {
    const userId = req.account._id
    const newGame = {
      title: req.body.title,
      description: req.body.description,
      players: [{ userId }],
      weights: [],
      userId: userId,
      starts_at: new Date(req.body.starts_at),
      ends_at: new Date(req.body.ends_at),
      picUrl: req.body.picUrl
    }

    console.log(newGame)

    Game.create(newGame)
      .then(creatorProfile => {
        res.status = 201
        res.json(creatorProfile)
      })
      .catch(error => next(error))
  })
  .put('/games/:id', authenticate, (req, res, next) => {
    const gameId = req.params.id
    const newGame = req.body
    const userId = req.account._id

    Game.findByIdAndUpdate(gameId,
      {
        ...newGame,
        user: userId
      },
      { new: true }
    )
      .then(game => {
        if (!game) {
          return next()
        }

        res.status = 200
        res.json(game)
      })
      .catch(error => next(error))
  })
  .patch('/games/:id', authenticate, (req, res, next) => {
    const gameId = req.params.id
    const newGame = {
      title: req.body.title,
      description: req.body.description,
      starts_at: new Date(req.body.starts_at),
      ends_at: new Date(req.body.ends_at),
      picUrl: req.body.picUrl
    }
    const userId = req.account._id
    Game.findByIdAndUpdate(
      gameId,
      {
        ...newGame,
        updatedAt: new Date()
      },
      { new: true }
    )
      .then(game => {
        if (!game) {
          return next()
        }
        res.status = 200
        res.json(game)
      })
      .catch(error => next(error))
  })
  .delete('/games/:id', authenticate, (req, res, next) => {
    const id = req.params.id

    Game.findByIdAndRemove(id)
      .then(res => {
        if (!res) {
          return next()
        }
        res.status = 204
      })
      .catch(error => next(error))
  })

module.exports = router
