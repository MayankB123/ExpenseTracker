const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'});
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d'});
}

module.exports = {generateAccessToken, generateRefreshToken}