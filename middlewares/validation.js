function validateEmail(req, res, next) {
    const { email, password } = req.body;
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
    const { email, password } = req.body;
    if (String(password)
    .match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)) {
        next();
    } else {
        console.error("Invalid Password")
        return res.redirect(`/register?error=invalid-password&email=${email}`);
    }
}

module.exports = {validateEmail, validatePassword}