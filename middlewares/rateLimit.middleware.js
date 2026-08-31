const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 5*60*1000,
    max: 5,
    message: {
        status: "error",
        message: "Đăng nhập quá nhiều lần. Thử lại sau 5 phút."
    }
});

module.exports = {
    loginLimiter
}