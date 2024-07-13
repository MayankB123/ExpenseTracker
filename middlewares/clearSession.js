function clearSession(req, res, next) {
    res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true, secure: true });
    res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true, secure: true });
    next();
}

module.exports = {clearSession};