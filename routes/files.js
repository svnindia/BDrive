const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/Files')

router.post('/', ctrl.validate, ctrl.create)
router.get('/:driveId', ctrl.get)
router.get('/:driveId/:folderId', ctrl.get)
router.delete('/:fileId', ctrl.remove)
router.put('/:fileId', ctrl.rename)

module.exports = router;