const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { authenticated } = require('../config/auth')
const Card = mongoose.model('Card')

router.get('/', authenticated, (req, res) => {
  const query = { archived: false }
  if (req.query.project) {
    query.project = req.query.project
  }
  if (req.query.organization) {
    query.organization = req.query.organization
  }
  Card.find(query)
    .populate('project')
    .sort('order')
    .exec((err, cards) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(cards)
      }
    })
})

router.get('/my', authenticated, (req, res) => {
  const query = {
    archived: false,
    members: [req.user._id],
    $and: [{ status: { $ne: 'backlog' } }, { status: { $ne: 'published' } }],
  }
  if (req.query.organization) {
    query.organization = req.query.organization
  }

  Card.find(query)
    .populate('project')
    .exec((err, cards) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.json(cards)
      }
    })
})

router.get('/:id', authenticated, (req, res) => {
  const query = { _id: req.params.id }
  Card.findOne(query).exec((err, card) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(card)
    }
  })
})

router.post('/', authenticated, (req, res) => {
  const newCard = new Card(req.body)
  newCard.save((err, card) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(card)
    }
  })
})

router.put('/reorder', authenticated, async (req, res) => {
  if (req.body.cards) {
    for (const item of req.body.cards) {
      await Card.findOneAndUpdate(
        {
          _id: item.id,
        },
        {
          $set: { order: item.order },
        },
        {
          upsert: true,
        }
      )
    }
  }
  res.json('ok')
})

router.put('/:id', authenticated, (req, res) => {
  const params = req.body
  const query = { _id: req.params.id }
  Card.findOneAndUpdate(
    query,
    {
      $set: params,
    },
    {
      upsert: true,
      new: true,
    },
    (err, card) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(card)
      }
    }
  )
})

router.delete('/:id', authenticated, (req, res) => {
  const query = { _id: req.params.id }

  Card.findOne(query).exec(async (err, card) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      card.archived = true
      await card.save()
      res.send(card)
    }
  })
})

module.exports = router
