const prisma = require('../config/prisma');

const createAccount = async (userId) => {
    const newAccount = await prisma.account.create({
        data: {
            userId : userId
        }
    });
    return newAccount
};

const findAccountById = async (accountId) => {
    const account = await prisma.account.findUnique({
        where : {
            id : accountId
        }
    })
    return account;
}

const increaseBalance = async (accountId, amount) => {
    const incrementBalance = prisma.account.update({
        where : {
            id: accountId
        },
        data: {
            balance: {
                increment: amount
            }
        }
    });

    const transactionLog = prisma.transaction.create({
        data: {
            amount: amount,
            senderId: accountId,
            receiverId: accountId,
            message: "Nạp tiền vào tài khoản"
        }
    });

    const result = await prisma.$transaction([incrementBalance, transactionLog]);
    return result[0];
}

const decreaseBalance = async (accountId, amount) => {
    const decrementBalance = prisma.account.update({
        where : {
            id: accountId
        },
        data: {
            balance: {
                decrement: amount
            }
        }
    });

    const transactionLog = prisma.transaction.create({
        data: {
            amount: amount,
            senderId: accountId,
            receiverId: accountId,
            message: "Rút tiền khỏi tài khoản"
        }
    });

    const result = await prisma.$transaction([decrementBalance, transactionLog]);
    return result[0];
}

const transferMoney = async (senderId, recieverId, amount) => {
    const senderUpdate = prisma.account.update({
        where: {
            id: senderId
        },
        data: {
            balance: {
                decrement: amount 
            }
        }
    });

    const receiverUpdate = prisma.account.update({
        where: {
            id: recieverId
        },
        data: {
            balance: {
                increment: amount 
            }
        }
    });

    const transactionLog = prisma.transaction.create({
        data: {
            amount: amount,
            senderId: senderId,
            receiverId: recieverId,
            message: "Chuyển tiền"
        }
    });

    const result = await prisma.$transaction([senderUpdate, receiverUpdate, transactionLog]);
    return result[2];
}; 

const getTransactionBySenderId = async (accountId, skip, take) => {
    const transactions = prisma.transaction.findMany({
        where: {
            OR: [
                { senderId: accountId },
                { receiverId: accountId }
            ]
        },
        orderBy: {
            createdAt: 'desc'
        },
        skip: skip,
        take: take
    });

    const totalCount = prisma.transaction.count({
        where: {
            OR: [
                { senderId: accountId },
                { receiverId: accountId }
            ]
        }
    });

    const result = await prisma.$transaction([transactions, totalCount]);

    return {
        transactions: result[0],
        totalCount: result[1]
    }
}

module.exports = {
    createAccount,
    findAccountById,
    increaseBalance,
    decreaseBalance,
    transferMoney,
    getTransactionBySenderId
}