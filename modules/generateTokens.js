const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function generateAccessToken(user) {
    return jwt.sign( {id: user.id, email: user.email, nickname: user.nickname} , process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'});
}

function generateRefreshToken(user) {
    return jwt.sign( {id: user.id, email: user.email, nickname: user.nickname} , process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d'});
}

module.exports = {generateAccessToken, generateRefreshToken}