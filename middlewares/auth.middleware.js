const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const jwtString = req.headers.authorization;
    if (!jwtString) {
        res.status(401).json({
            status: 'error',
            message: 'Không tìm thấy chuỗi jwt'
        });
        return;
    }
    const token = jwtString.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user  = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            status: "error",
            message: error.message
        });
    }
}

const checkRole = (allowedRole) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!allowedRole.includes(userRole)) {
            res.status(403).json({
                status: "error",
                message: "Không có quyền thực thi hành động này (Forbidden)"
            });
            return;
        }
        next();
    };
};

module.exports = {
    verifyToken,
    checkRole
}