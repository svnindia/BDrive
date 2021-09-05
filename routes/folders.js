const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/Folders.js')

router.post('/', ctrl.validate, ctrl.create)
router.get('/', ctrl.get)
router.delete('/:folderId', ctrl.remove)
router.put('/:folderId', ctrl.rename)
router.get('/:folderId', ctrl.get)

module.exports = router;