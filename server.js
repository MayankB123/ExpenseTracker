const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

app.listen(
    process.env.PORT,
    () => {console.log("Started server")}
);

app.get('/', (req, res) => {
    res.status(200).redirect('/login');
});

const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registerRouter = require('./routes/register');
const dashboardRouter = require('./routes/dashboard');
const incomeRouter = require('./routes/income');
const expensesRouter = require('./routes/expenses');
const apiRouter = require('./routes/api')
const verificationRouter = require('./routes/verification')
const forgotPasswordRouter = require('./routes/forgot-password')
const resetPasswordRouter = require('./routes/reset-password')
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/dashboard', dashboardRouter);
app.use('/income', incomeRouter);
app.use('/expenses', expensesRouter);
app.use('/api', apiRouter);
app.use('/verification', verificationRouter);
app.use('/forgot-password', forgotPasswordRouter);
app.use('/reset-password', resetPasswordRouter);

// Currency conversion API - https://api.exchangerate-api.com/v4/latest/${currency e.g. 'usd'}