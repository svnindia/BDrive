const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send({'message': 'Hello Challange!'}))

module.exports = router;