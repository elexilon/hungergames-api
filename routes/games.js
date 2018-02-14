// routes/games.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Game } = require('../models')
const utils = require('../lib/utils')

const authenticate = passport.authorize('jwt', { session: false })

// const calculateWinner = (squares) => {
//   const lines = [
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9],
//     [1, 5, 9],
//     [3, 5, 7],
//     [1, 4, 7],
//     [2, 5, 8],
//     [3, 6, 9],
//   ]
// console.log(lines);
//   lines.forEach(line => {
//     const filterline = squares.filter(square => {
//       line.indexOf(square) > -1
//     })
//     if(filterline.length === 3)
//   })
// }
//
// this.calculateWinner([1,2,3])


module.exports = io => {
  router
    .get('/games', (req, res, next) => {
      Game.find()
        // Newest games first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((games) => res.json(games))
        // Throw a 500 error if something goes wrong
        .catch((error) => next(error))
    })
    .get('/games/:id', (req, res, next) => {
      const id = req.params.id


      Game.findById(id)
        .then((game) => {
          if (!game) { return next() }
          res.json(game)
        })
        .catch((error) => next(error))
    })
    .post('/games', authenticate, (req, res, next) => {
      const newGame = {
        userId: req.account._id,
        players: [{
          userId: req.account._id,
          symbol: Math.random() === 0 ? 'X' : 'O',
          squares: []
        }],
        squares: []
      }

      Game.create(newGame)
        .then((game) => {
          const error = Error.new('You already joined this game!')
          error.status = 401
          return next(error)
          io.emit('action', {
            type: 'GAME_CREATED',
            payload: game
          })
          res.json(game)
        })
        .catch((error) => next(error))
    })
    .post('/games/:id/players', authenticate, (req, res, next) => {
      const id = req.params.id
      const patchForGame = req.body

      Game.findById(id)
        .then((game) => {
          if (!game) { return next() }

          if(game.players.length > 1){
            const error = Error.new('Sorry game is full!')
            error.status = 401
            return next(error)
          }
          const newSymbol = game.players[0].symbol === 'X' ? 'O' : 'X'

          const players = { players: [game.players[0], {
            userId: req.account._id,
            symbol: newSymbol,
            squares: []
          }]}

          const updatedGame = { ...game,  ...players }
          Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
            .then((game) => {
              io.emit('action', {
                type: 'GAME_UPDATED',
                payload: game
              })
              res.json(game)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .post('/play/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const squareId = req.body

      Game.findById(id)
        .then((game) => {
          if (!game) { return next() }

          const turn = game.turn
          const gameSquares = game.squares

          if(game.players[turn].userId !== currentUser._id){
              io.emit('action', {
                type: 'LOAD_ERROR',
                payload: 'Wait for your turn'
              })
              return next()
          }
          if(gameSquares.filter(square => square > squareId ).length > 0){
              io.emit('action', {
                type: 'LOAD_ERROR',
                payload: 'The position is taken'
              })
              return next()
          }
          if(!game.winnerId){
              io.emit('action', {
                type: 'LOAD_ERROR',
                payload: 'The game has a winner'
              })
              return next()
          }

          const userSquares = { ...game.players[turn].squares, squares: squareId }


          const isWinner = calculateWinner(userSquares)



          // {
          //   winnerId: { isWinner: isWinner ? currentUser : null },
          //   squares: { ...game.squares, gameSquares },
          //   players: { ...game.players, }
          // }


          // const players = { players: [game.players[0], {
          //   userId: req.account._id,
          //   symbol: newSymbol,
          //   squares: []
          // }]}
          //
          // const updatedGame = { ...game.players,  players: players }
          // Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
          //   .then((game) => {
          //     io.emit('action', {
          //       type: 'GAME_UPDATED',
          //       payload: game
          //     })
          //     res.json(game)
          //   })
          //   .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .put('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const updatedGame = req.body

      Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
        .then((game) => {
          io.emit('action', {
            type: 'GAME_UPDATED',
            payload: game
          })
          res.json(game)
        })
        .catch((error) => next(error))
    })
    .patch('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const patchForGame = req.body

      Game.findById(id)
        .then((game) => {
          if (!game) { return next() }

          const updatedGame = { ...game, ...patchForGame }

          Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
            .then((game) => {
              io.emit('action', {
                type: 'GAME_UPDATED',
                payload: game
              })
              res.json(game)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .delete('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      Game.findByIdAndRemove(id)
        .then(() => {
          io.emit('action', {
            type: 'GAME_REMOVED',
            payload: id
          })
          res.status = 200
          res.json({
            message: 'Removed',
            _id: id
          })
        })
        .catch((error) => next(error))
    })

  return router
}
