const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js')
const { generateAccessToken, generateRefreshToken } = require('../modules/generateTokens.js')
const { clearSession } = require('../middlewares/clearSession.js')


const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/', clearSession, (req, res) => {
    res.render('public/login.ejs');
});

router.post('/', async (req, res) => {

    const { email, password } = req.body;
    
    const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email);

    if (error) {
        console.error("Supabase error in fetching right user", error)
        return res.status(500).redirect('/login?login=server-failure')
    }

    else if (data.length === 0) {
        return res.status(400).redirect('/login?login=client-failure')
    }

    else if (data.length > 1) {
        return res.status(400).redirect('/login?login=client-failure')
    }

    else {
        const dbPassword = data[0].password;
    try {
        if (await bcrypt.compare(password, dbPassword)) {
            const user = data[0];
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'Strict', 
                });
            
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict', 
                });

            res.redirect('/dashboard')
        }
        else {
            return res.redirect('/login?login=client-failure');
        }
    } catch {
        console.error("Error in comparing passwords or getting jwt", error)
        return res.status(500).redirect('/login?login=server-failure');
    }
    }    
});

module.exports = router;