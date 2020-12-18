const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const fileUpload = require('../middleware/image_upload');

router.post('/login', userController.login );
router.post('/signup', fileUpload.single('avatar'), userController.signUp);
router.get('/', userController.getUsers);

module.exports = router;