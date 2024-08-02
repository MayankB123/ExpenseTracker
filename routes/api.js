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

router.get('/expenses', authenticateToken, async (req, res) => {
    const expenses = await retrieveExpenses(req.user);

    const currency = cache.get(`${req.user.id}-currency`);

    const response = await fetch('https://api.exchangerate-api.com/v4/latest/usd')

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
    const exchangeRates = await response.json();

    const conversion = exchangeRates.rates[currency];

    const updatedExpenses = expenses.map(expense => {
        return {
          ...expense,
          amount: expense.amount * conversion
        };
      });
    res.status(200).json(updatedExpenses)
});

router.post('/expenses', authenticateToken, async (req, res) => {
    const { category, description, amount } = req.body;
    const user = req.user;
    const result = insertExpense(user, category, description, amount);
    if (result) {
        res.status(200).send();
    }
    else {
        res.status(400).send();
    }
});

router.get('/income', authenticateToken, async (req, res) => {
    const income = await retrieveIncome(req.user);
    
    const currency = cache.get(`${req.user.id}-currency`);

    const response = await fetch('https://api.exchangerate-api.com/v4/latest/usd')

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
    const exchangeRates = await response.json();

    const conversion = exchangeRates.rates[currency];

    const updatedIncome = income.map(item => {
        return {
          ...item,
          amount: item.amount * conversion
        };
      });

    res.status(200).json(updatedIncome)
});

router.post('/income', authenticateToken, async (req, res) => {
    const { category, description, amount } = req.body;
    const user = req.user;
    const result = insertIncome(user, category, description, amount);
    if (result) {
        res.status(200).send();
    }
    else {
        res.status(400).send();
    }
});

router.get('/monthly-budget', authenticateToken, async (req, res) => {
    const monthlyBudget = await retrieveMonthlyBudget(req.user);
    
    const currency = cache.get(`${req.user.id}-currency`);

    const response = await fetch('https://api.exchangerate-api.com/v4/latest/usd')

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
    const exchangeRates = await response.json();

    const conversion = exchangeRates.rates[currency];

    const updatedMonthlyBudget = monthlyBudget[0].amount * conversion;

    res.status(200).json({monthlyBudget: updatedMonthlyBudget});
});

router.post('/monthly-budget', authenticateToken, async (req, res) => {
    const monthlyBudget = parseInt(req.body.budget);
    const user = req.user;
    const result = await updateMonthlyBudget(user, monthlyBudget)
    if (result) {
        res.status(200).send();
    }
    else {
        res.status(400).send();
    }
});

router.get('/income-goal', authenticateToken, async (req, res) => {
    const incomeGoal = await retrieveIncomeGoal(req.user);
    
    const currency = cache.get(`${req.user.id}-currency`);

    const response = await fetch('https://api.exchangerate-api.com/v4/latest/usd')

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
    const exchangeRates = await response.json();

    const conversion = exchangeRates.rates[currency];

    const updatedIncome = incomeGoal[0].amount * conversion;

    res.status(200).json({incomeGoal: updatedIncome});
});

router.post('/income-goal', authenticateToken, async (req, res) => {
    const incomeGoal = parseInt(req.body.incomeGoal);
    const user = req.user;
    const result = await updateIncomeGoal(user, incomeGoal)
    if (result) {
        res.status(200).send();
    }
    else {
        res.status(400).send();
    }
});

router.post('/change-currency', authenticateToken, async (req, res) => {
    const currency = req.body.currency;
    cache.del(`${req.user.id}-currency`)
    cache.set(`${req.user.id}-currency`, currency)
    res.status(200).send()
});

router.post('/resend-code/:email', async (req, res) => {
    const email = req.params.email;

    const information = cache.get(email)
    
    const newOtp = crypto.randomInt(100000, 1000000);

    information.otp = newOtp;

    const subject = "Expense Tracker Email Verification";

    const text = `Your Pass Code is ${newOtp}`

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

    res.status(200).send();
});

module.exports = router;