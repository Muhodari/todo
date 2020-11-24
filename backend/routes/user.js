const express = require('express');
const userController = require('../controllers/user.controller')

const router = express();

router.post("/signup", userController.createUser);

router.post("/login", userController.userLogin)

module.exports = router;