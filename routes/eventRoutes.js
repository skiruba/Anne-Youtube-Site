const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventController');
const {fileUpload} = require('../middleware/fileUpload');
const {isLoggedIn, isAuthor} = require('../middleware/auth');
const {validateId} = require('../middleware/validator');

router.get('/', controller.index);

router.get('/newEvent', isLoggedIn, controller.new);

router.post('/', isLoggedIn, fileUpload, controller.create)

router.get('/:id', validateId, controller.show);

router.get('/:id/edit', isLoggedIn, validateId, isAuthor, controller.edit);

router.put('/:id', isLoggedIn, validateId, isAuthor, fileUpload, controller.update);

router.delete('/:id', isLoggedIn, validateId, isAuthor, controller.delete);

module.exports = router;