const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js')
const sanitizeHtml = require('sanitize-html');
const { validateEmail, validatePassword, validateNickname, checkEmailAlreadyExists} = require('../middlewares/validation.js')
const { clearSession } = require('../middlewares/clearSession.js')

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/', clearSession, (req, res) => {
    res.render('public/register.ejs');
});

router.post('/', validateEmail, validatePassword, validateNickname, checkEmailAlreadyExists, async (req, res) => {
    const { email, nickname, password } = req.body; 

    const sanitizedNickname = sanitizeHtml(nickname, {
        allowedTags: [],
        allowedAttributes: {},
    });
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { error } = await supabase
        .from('users')
        .insert({
            email: email,
            nickname: sanitizedNickname,
            password: hashedPassword
        });

        const { data, error2 } = await supabase
        .from('users')
        .select()
        .eq('email', email);

        if (data.length === 0) {
            return res.status(400).redirect('/login?login=client-failure')
        }
    
        else if (data.length > 1) {
            return res.status(400).redirect('/login?login=client-failure')
        }

        const user_ID = data[0].id;

        const { error3 } = await supabase
        .from('monthly-budget')
        .insert({ user_id: user_ID, amount: 1000 })

        if (error3) {
            console.error(`Error setting monthly budget: `, error);
            return res.redirect('/login?registration=failure');
        }

        if (error) {
            console.error(error);
            return res.redirect('/login?registration=failure');
        }

        if (error2) {
            console.error(error2);
            return res.redirect('/login?registration=failure');
        }

        return res.redirect('/login?registration=success');
    } catch {
        console.log("Suwi")
        return res.redirect('/login?registration=failure');
    }
});

module.exports = router;