const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js')
const { authenticateToken } = require('../middlewares/authorization.js');


const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.delete('/', authenticateToken, async (req, res) => {

    res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true, secure: true });
    res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true, secure: true });
    res.status(204).send('/login');

});

module.exports = router;