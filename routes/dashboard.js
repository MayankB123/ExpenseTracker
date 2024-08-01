const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js');
const { authenticateToken } = require('../middlewares/authorization.js');
const cache = require('../modules/cache.js')

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/', authenticateToken, (req, res) => {
    const currency = cache.get(`${req.user.id}-currency`)
    res.render('public/dashboard.ejs', {user: req.user, currency: currency});
});

module.exports = router;