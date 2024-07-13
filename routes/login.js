const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js')
const { generateAccessToken, generateRefreshToken } = require('../modules/generateTokens.js')


const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/', (req, res) => {
    res.render('public/login.html');
});

router.post('/', async (req, res) => {

    const { email, password } = req.body;
    
    const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email);

    if (error) {
        console.error("Supabase error in fetching right user", error)
        return res.redirect('/login?login=server-failure')
    }

    else if (data.length === 0) {
        return res.redirect('/login?login=client-failure')
    }

    else if (data.length > 1) {
        return res.redirect('/login?login=client-failure')
    }

    else {
        const dbPassword = data[0].password;
    try {
        if (await bcrypt.compare(password, dbPassword)) {
            const user = data[0];
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            res.json({accessToken: accessToken, refreshToken: refreshToken})
        }
        else {
            return res.redirect('/login?login=client-failure');
        }
    } catch {
        console.error("Error in comparing passwords or getting jwt", error)
        return res.redirect('/login?login=server-failure');
    }
    }    
});

module.exports = router;