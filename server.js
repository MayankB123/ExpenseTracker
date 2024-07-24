const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

app.listen(
    PORT,
    () => {console.log("Started server")}
);

const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registerRouter = require('./routes/register');
const dashboardRouter = require('./routes/dashboard');
const incomeRouter = require('./routes/income');
const expensesRouter = require('./routes/expenses');
const apiRouter = require('./routes/api')
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/dashboard', dashboardRouter);
app.use('/income', incomeRouter);
app.use('/expenses', expensesRouter);
app.use('/api', apiRouter);

// Currency conversion API - https://api.exchangerate-api.com/v4/latest/${currency e.g. 'usd'}