const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const { authenticateToken } = require('../middlewares/authorization.js');
const cache = require('../modules/cache.js')


router.get('/', authenticateToken, async (req, res) => {
    res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true, secure: true });
    res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true, secure: true });
    cache.del(req.user.id);
    res.status(200).redirect('/login')
});

module.exports = router;