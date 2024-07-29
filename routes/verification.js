const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js')
const sanitizeHtml = require('sanitize-html');
const cache = require('../modules/cache.js');

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/', (req, res) => {
    res.render('public/verification.ejs');
});

router.post('/', async (req, res) => {
    
    const code = req.body.verificationCode;
    const email = req.body.email;

    const information = cache.get(email)
    const correctCode = information.otp
    console.log(correctCode)

    if (correctCode == code) {
        cache.del(email)

        try {
            const email = information.email
            const sanitizedNickname = information.nickname
            const password = information.password
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
            .insert({ user_id: user_ID, amount: 5000 })

            const { error4 } = await supabase
            .from('income-goal')
            .insert({ user_id: user_ID, amount: 5000 })
    
            if (error3) {
                console.error(`Error setting monthly budget: `, error);
                return res.redirect('/login?registration=failure');
            }

            if (error4) {
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

    } else {
        res.status(401).redirect(`/verification?email=${email}&success=false`)
    }
});

module.exports = router;