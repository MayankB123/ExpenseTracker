const supabaseApp = require('@supabase/supabase-js')

const supabase = supabaseApp.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function validateEmail(req, res, next) {
    const { email, nickname, password } = req.body;
    if (String(email)
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        next();
    } else {
        console.error("Invalid Email")
        return res.redirect('/register?error=invalid-email');
    }
};

function validatePassword(req, res, next) {
    const { email, nickname, password } = req.body;
    if (String(password)
    .match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)) {
        next();
    } else {
        console.error("Invalid Password")
        return res.redirect(`/register?error=invalid-password&email=${email}`);
    }
}

function validateNickname(req, res, next) {
    const { email, nickname, password } = req.body;
    if (nickname.length < 3) {
        console.error("Nickname too short.")
        return res.redirect(`/register?error=invalid-nickname&email=${email}&password=${password}`);
    }
    next();
}

async function checkEmailAlreadyExists(req, res, next) {
    const { email, nickname, password } = req.body;

    const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .limit(1); 

    if (error) {
        console.error('Error checking email existence:', error);
        return res.redirect('/login?registration=failure');
    }

    console.log(data)

    if (data.length !== 0) {
        return res.redirect('/register?error=email-taken');
    }

    next();
}

module.exports = {validateEmail, validatePassword, validateNickname, checkEmailAlreadyExists}