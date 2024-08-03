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

router.get('/:id', async (req, res) => {
    
    const id = req.params.id;

    const email = cache.get(id)

    cache.set(id, email, 300000);
    
    if (email) {
        console.log(email)
        res.render('public/reset-password.ejs')
    } else {
        res.redirect('/login')
    }
});

router.post('/:id', async (req, res) => {
    const password = req.body.password;
    const email = cache.get(req.params.id);
    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
    .from('users')
    .update({ password: hashedPassword })
    .eq('email', email)

    if (error) {
        res.redirect('/login?login=server-failure')
    }

    cache.del(req.params.id)

    res.redirect('/login?password-reset=true')
});

module.exports = router;