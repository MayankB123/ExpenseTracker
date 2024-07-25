const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js')

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function retrieveExpenses(user) {
    const userID = user.id;

    const { data, error } = await supabase
    .from('expenses')
    .select()
    .eq('user_id', userID);

    if (error) {
        console.error(error)
        return []
    }

    return data;
}

async function retrieveIncome(user) {
    const userID = parseInt(user.id);

    const { data, error } = await supabase
    .from('income')
    .select()
    .eq('user_id', userID);

    if (error) {
        console.error(error)
        return []
    }

    return data;
}

async function retrieveMonthlyBudget(user) {
    const userID = parseInt(user.id);

    const { data, error } = await supabase
    .from('monthly-budget')
    .select()
    .eq('user_id', userID)
    .limit(1);

    if (error) {
        console.error(error)
        return "Failed to load data."
    }

    return data;
}

module.exports = {retrieveExpenses, retrieveIncome, retrieveMonthlyBudget}