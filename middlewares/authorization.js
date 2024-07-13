const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function authenticateToken(req, res, next) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
        return res.status(401).redirect('/login?session=expired');
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err && refreshToken) {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).redirect('/login?session=expired');
                }

                const newAccessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });

                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', 
                    sameSite: 'Strict', 
                    });

                req.user = user;
                next();
            });
        } else if (err) {
            return res.status(403).redirect('/login?session=expired');
        } else {
            req.user = user;
            next();
        }
    });
}

module.exports = {authenticateToken};