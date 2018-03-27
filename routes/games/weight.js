const router = require('express').Router()
const { Game } = require('../models')
const passport = require('../config/auth')
const authenticate = passport.authorize('jwt', { session: false })

router
  .put('/weights/:id', authenticate, (req, res, next) => {
    const gameId = req.params.id
    const weight = req.body.weight
    const userId = req.account._id

    Game.findById(gameId)
      .then(game => {
        if (!game) {
          return next()
        }

        const oldWeights = game.weights.filter(weight => {
          weight.userId !== req.body.weight && weight.date === req.body.date
        })




      })

    // Game.findByIdAndUpdate(
    //     gameId,
    //     {
    //         ...newGame,
    //         updatedAt: new Date()
    //     },
    //     { new: true }
    // )
    //     .then(game => {
    //         if (!game) {
    //             return next()
    //         }
    //         res.status = 200
    //         res.json(game)
    //     })
    //     .catch(error => next(error))
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
