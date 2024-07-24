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
            console.error(`Error inserting budget: `, error);
            return false;
        }
    } catch (error) {
        console.error('Error inserting monthly budget:', error.message);
        return false;
    }

    return true;
}

module.exports = {updateMonthlyBudget}