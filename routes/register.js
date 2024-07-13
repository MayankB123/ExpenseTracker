const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js')
const { validateEmail, validatePassword} = require('../middlewares/validation.js')
const { clearSession } = require('../middlewares/clearSession.js')

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/', clearSession, (req, res) => {
    res.render('public/register.html');
});

router.post('/', validateEmail, validatePassword, async (req, res) => {
    const { email, password } = req.body; 
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { error } = await supabase
        .from('users')
        .insert({
            email: email,
            password: hashedPassword
        });

        if (error) {
            console.log(error);
            return res.redirect('/login?registration=failure');
        }

        return res.redirect('/login?registration=success');
    } catch {
        console.log("Suwi")
        res.redirect('/login?registration=failure');
    }
});

module.exports = router;