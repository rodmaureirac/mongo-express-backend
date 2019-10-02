const router = require('express').Router()
const auth = require('../middlewares/auth')

router.get('/private', auth, (req, res) => res.send('Access grant'))

module.exports = router