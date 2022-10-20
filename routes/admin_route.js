const express = require('express');
const controller = require('../controllers/admin_controller');
const auth = require('../middleware/authenication');

const router = express.Router();

router.post('/login', controller.adminLogin);
router.get('/getAllUsers', auth, controller.getUserData);
router.put('/updateUserStatus', auth, controller.updateUserStatus);
router.delete('/userDelete/:id', auth, controller.userdelete);
router.put('/userSoftdelete', auth, controller.userSoftdelete);

module.exports = router;
