const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const cache = require('./cache')

function generateAccessToken(user) {
    return jwt.sign( {id: user.id, email: user.email, nickname: user.nickname} , process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'});
}

function generateRefreshToken(user) {
    const refreshToken = jwt.sign( {id: user.id, email: user.email, nickname: user.nickname} , process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d'});
    cache.set(user.id, refreshToken, 86400);
    return refreshToken;
}

module.exports = {generateAccessToken, generateRefreshToken}