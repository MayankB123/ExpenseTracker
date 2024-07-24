const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const supabaseApp = require('@supabase/supabase-js')

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function insertExpense(user, category, description, amount) {
    const categories = ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Travel', 'Savings', 'Debt Repayment', 'Healthcare', 'Transportation', 'Miscellaneous']
    const userID = parseInt(user.id);

    if (!(categories.includes(category))) {
        return false;
    }

    amount = parseFloat(amount);

    try {
        const { error } = await supabase
                .from('expenses')
                .insert({ user_id: userID, category: category, amount: amount, description: description })

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

module.exports = {insertExpense}