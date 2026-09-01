const { ppid } = require('node:process');
const prisma = require('../config/prisma');
const createUser = async (fullName, email, password, roleId) => {
    const newUser = await prisma.user.create({
        data: {
            fullName: fullName,
            email: email,
            password: password,
            roleId: roleId
        }
    });
    return newUser;
};

const findUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email : email
        },
        include: {
            role: true
        }
    })
    return user;
}


module.exports = {
    createUser,
    findUserByEmail
}