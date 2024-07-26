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

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.get('/expenses', authenticateToken, async (req, res) => {
    const expenses = await retrieveExpenses(req.user);
    res.status(200).json(expenses)
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
    const expenses = await retrieveIncome(req.user);
    res.status(200).json(expenses)
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
    res.status(200).json({monthlyBudget: monthlyBudget[0].amount});
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
    res.status(200).json({incomeGoal: incomeGoal[0].amount});
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

module.exports = router;