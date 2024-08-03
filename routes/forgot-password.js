const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js');
const { authenticateToken } = require('../middlewares/authorization.js');
const { retrieveExpenses, retrieveIncome, retrieveMonthlyBudget, retrieveIncomeGoal } = require('../modules/retrieveData.js');
const { updateMonthlyBudget, updateIncomeGoal } = require('../modules/updateData.js')
const { insertExpense, insertIncome } = require('../modules/insertData.js')
const cache = require('../modules/cache.js')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

router.get('/', async (req, res) => {
    res.render('public/forgot-password.ejs')
});

router.post('/', async (req, res) => {
    const email = req.body.email;
    const randomURL = crypto.randomBytes(32).toString('hex');
    console.log(randomURL);
    console.log(email);

    const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email);

    if (error) {
        console.error("Supabase error in fetching right user", error)
        return res.status(500).redirect('/login?login=server-failure')
    }

    console.log(data)

    if (data.length == 0) {
        console.log("No user")
    } else {
    console.log("Yes user")
    const subject = "Expense Tracker Email Verification";

    const text = `Click this link to reset your password: http://localhost:3000/reset-password/${randomURL}`

    cache.set(randomURL, email, 300000);

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
    }
    res.status(200).redirect('/login?forgot-password=true');
});

module.exports = router;