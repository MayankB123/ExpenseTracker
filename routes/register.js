const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const supabaseApp = require('@supabase/supabase-js')
const sanitizeHtml = require('sanitize-html');
const { validateEmail, validatePassword, validateNickname, checkEmailAlreadyExists} = require('../middlewares/validation.js')
const cache = require('../modules/cache.js')

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "noreplymail.expensetracker@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/', (req, res) => {
    res.render('public/register.ejs');
});

router.post('/', validateEmail, validatePassword, validateNickname, checkEmailAlreadyExists, async (req, res) => {
    const { email, nickname, password } = req.body; 

    const sanitizedNickname = sanitizeHtml(nickname, {
        allowedTags: [],
        allowedAttributes: {},
    });

    const otp = crypto.randomInt(100000, 1000000);

    const information = {
        email: email,
        nickname: sanitizedNickname,
        password: password,
        otp: otp
    }

    const subject = "Expense Tracker Email Verification";

    const text = `Your Pass Code is ${otp}`

    cache.set(email, information, 300000);

    try {
        let info = await transporter.sendMail({
            from: "noreplymail.expensetracker@gmail.com",
            to: email,
            subject: subject,
            text: text
        })
    } catch (error) {
        console.error(error)
        res.status(500).redirect('/login?login=server-failure')
    }

    res.status(200).redirect(`/verification?email=${email}`);
});

module.exports = router;