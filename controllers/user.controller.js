const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync')

const register = catchAsync(async (req, res) => {
    const { fullName, email, password, role } = req.body;

    const newUser = await userService.registerUser(fullName, email, password, role);

    res.status(201).json({
        status: "Created",
        message: "Tạo tài khoản thành công",
        data: newUser
    })
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const token = await userService.loginUser(email, password);

    res.status(200).json({
        status: "success",
        message: "Đăng nhập thành công",
        data: token
    });
});

module.exports = {
    register,
    login
}