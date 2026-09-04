const prisma = require('../config/prisma');

const createAccount = async (userId) => {
    const newAccount = await prisma.account.create({
        data: {
            userId : userId
        }
    });
    return newAccount
};

const findUserByAccountId = async (accountId) => {
    const account = await prisma.account.findUnique({
        where: {
            id: accountId
        },
        select : {
            user: true
        }
    })
    return account?.user;
}

const findAccountById = async (accountId) => {
    const account = await prisma.account.findUnique({
        where : {
            id : accountId
        }
    })
    return account;
}

const increaseBalance = async (accountId, amount) => {
    return await prisma.$transaction(async (tx) => {
        const accounts = await tx.$queryRaw`SELECT balance FROM Account WHERE id = ${accountId} FOR UPDATE`;
        if (!accounts || accounts.length === 0) {
            throw new Error("Không tìm thấy tài khoản.");
        }
        await tx.account.update({
            where: {
                id: accountId
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        });
        const transactionLog = await tx.transaction.create({
            data: {
                amount: amount,
                senderId: accountId,
                receiverId: accountId,
                message: "Nạp tiền vào tài khoản"
            }
        });
        return transactionLog;
    });
};

const decreaseBalance = async (accountId, amount) => {
    return await prisma.$transaction(async (tx) => {
        const accounts = await tx.$queryRaw`SELECT balance FROM Account WHERE id = ${accountId} FOR UPDATE`;
        if (!accounts || accounts.length === 0) {
            throw new Error("Không tìm thấy tài khoản.");
        }
        const balance = accounts[0].balance;
        if (balance < amount) {
            throw new Error("Số dư không đủ để thực hiện giao dịch.");
        }
        await tx.account.update({
            where: {
                id: accountId
            },
            data: {
                balance: {
                    decrement: amount
                }
            }
        });
        const transactionLog = await tx.transaction.create({
            data: {
                amount: amount,
                senderId: accountId,
                receiverId: accountId,
                message: "Rút tiền khỏi tài khoản"
            }
        });

        return transactionLog;
    });
};

const transferMoney = async (senderId, receiverId, amount) => {
    return await prisma.$transaction(async (tx) => {
        const senders = await tx.$queryRaw`SELECT balance FROM Account WHERE id = ${senderId} FOR UPDATE`;
        if (!senders || senders.length === 0) {
            throw new Error("Không tìm thấy tài khoản gửi.");
        }
        const senderBalance = senders[0].balance;
        if (senderBalance < amount) {
            throw new Error("Số dư không đủ để thực hiện giao dịch.");
        }
        const receiver = await tx.account.findUnique({
            where: { id: receiverId }
        });
        if (!receiver) {
            throw new Error("Không tìm thấy tài khoản nhận.");
        }
        await tx.account.update({
            where: { id: senderId },
            data: { balance: { decrement: amount } }
        });
        await tx.account.update({
            where: { id: receiverId },
            data: { balance: { increment: amount } }
        });
        const transactionLog = await tx.transaction.create({
            data: {
                amount: amount,
                senderId: senderId,
                receiverId: receiverId,
                message: "Chuyển tiền"
            }
        });
        return transactionLog;
    });
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
    getTransactionBySenderId,
    findUserByAccountId
}