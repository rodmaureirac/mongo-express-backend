const router = require('express').Router()

router.get('/public', (req, res) => res.send('Anyone can see this'))

module.exports = router