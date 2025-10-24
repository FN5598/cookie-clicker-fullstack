const express = require('express');
const { register, login, logout, refresh, checkUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);

router.post("/login", login);

router.post('/logout', logout);

router.post('/refresh', refresh);

router.get('/check', checkUser);

module.exports = router;