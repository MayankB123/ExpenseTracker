const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js')

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateMonthlyBudget(user, monthlyBudget) {
    const userID = parseInt(user.id);

    try {
        const { error } = await supabase
            .from('monthly-budget')
            .update({ amount: monthlyBudget })
            .eq('user_id', userID);

        if (error) {
            console.error(`Error updating monthly budget: `, error);
            return false;
        }
    } catch (error) {
        console.error('Error updating monthly budget:', error.message);
        return false;
    }

    return true;
}

async function updateIncomeGoal(user, incomeGoal) {
    const userID = parseInt(user.id);

    try {
        const { error } = await supabase
            .from('income-goal')
            .update({ amount: incomeGoal })
            .eq('user_id', userID);

        if (error) {
            console.error(`Error updating income goal: `, error);
            return false;
        }
    } catch (error) {
        console.error('Error updating income goal:', error.message);
        return false;
    }

    return true;
}

module.exports = {updateMonthlyBudget, updateIncomeGoal}