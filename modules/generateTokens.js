const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function generateAccessToken(user) {
    return jwt.sign( {email: user.email} , process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'});
}

function generateRefreshToken(user) {
    return jwt.sign( {email: user.email} , process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d'});
}

module.exports = {generateAccessToken, generateRefreshToken}