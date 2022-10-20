const express = require('express');
const controller = require('../controllers/user_controller');
const auth = require('../middleware/authenication');

const router = express.Router();

router.post('/signup', controller.create);
router.post('/login', controller.login);
router.post('/verifyEmail', controller.user_emailVerify);
router.post('/verifyPhone', controller.user_PhoneVerify);
router.post('/forgotPassword', auth, controller.forgotPassword);
router.put('/resetPassword', auth, controller.resetPassword);

module.exports = router;
