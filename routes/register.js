const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js')
const { validateEmail, validatePassword} = require('../modules/validation.js')

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/', (req, res) => {
    res.render('public/register.html');
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    const validEmail = validateEmail(email);
    if (!validEmail) {
        return res.redirect('/register?error=invalid-email');
    }
    const validPassword = validatePassword(password);
    if (!validPassword) {
        return res.redirect(`/register?error=invalid-password&email=${email}`);
    } 

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