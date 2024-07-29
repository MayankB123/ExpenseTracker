const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const cache = require('../modules/cache.js')

function authenticateToken(req, res, next) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
        return res.status(401).redirect('/login?session=invalid');
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err && refreshToken) {
            
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (cache.get(user.id) == refreshToken) {
                if (err) {
                    return res.status(403).redirect('/login?session=expired');
                }

                const newAccessToken = jwt.sign({ id: user.id, email: user.email, nickname: user.nickname }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });

                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', 
                    sameSite: 'Strict', 
                    });

                req.user = user;
                next();
                } else {
                    return res.status(403).redirect('/login?session=invalid');
                }
            });
            
        } else if (err) {
            return res.status(403).redirect('/login?session=invalid');
        } else {
            req.user = user;
            next();
        }
    });
}

module.exports = {authenticateToken};