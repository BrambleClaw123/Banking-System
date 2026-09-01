require('dotenv').config();
const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registerUser = async (fullName, email, password, role) => {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
        throw new Error("Email này đã được sử dụng!");
    }

    const round = 10;
    const hashedPassword = await bcrypt.hash(password, round);

    const newUser = await userRepository.createUser(fullName, email, hashedPassword, role);

    return newUser;
};


const loginUser = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error("Sai thông tin đăng nhập");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Sai thông tin đăng nhập");
    }
    const token = jwt.sign({id: user.id, role: user.role.name}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return token;
}

module.exports = {
    registerUser,
    loginUser
}