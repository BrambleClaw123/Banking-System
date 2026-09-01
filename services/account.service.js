const accountRepository = require('../repositories/account.repository');
const emailService = require('../services/email.service')
const getBalance = async (accountId) => {
    const account = await accountRepository.findAccountById(accountId);
    if (!account) {
        throw new Error("Không tìm thấy tài khoản.");
    }
    return account.balance;
}

const depositMoney = async (accountId, amount) => {
    if (amount <= 0) {
        throw new Error("Số tiền nạp phải là số dương khác 0");
    }

    const updatedAccount = await accountRepository.increaseBalance(accountId,amount);

    sendEmail(accountId, "DEPOSIT", amount);

    return updatedAccount;
}

const withdrawMoney = async (accountId, amount) => {
    if (amount <= 0) {
        throw new Error("Số tiền rút phải là số dương khác 0");
    }
    
    const updatedAccount = await accountRepository.decreaseBalance(accountId, amount);

    sendEmail(accountId, "WITHDRAW", amount);

    return updatedAccount;
}

const openBankAccount = async (userId) => {
    return accountRepository.createAccount(userId);
};

const transfer = async (senderId, recieverId, amount) => {
    if (amount <= 0) {
        throw new Error("Số tiền chuyển phải là số dương khác 0");
    }
    if (senderId === recieverId) {
        throw new Error("Không thể chuyển tiền cho chính mình");
    }
    const transaction = await accountRepository.transferMoney(senderId, recieverId, amount);

    sendEmail(senderId, "TRANSFER_SENT", amount);
    sendEmail(recieverId, "TRANSFER_RECEIVE", amount);

    return transaction;
}

const getTransactions = async (accountId, page, limit) => {
    const account = await accountRepository.findAccountById(accountId);
    if (!account) {
        throw new Error("Không tìm thấy tài khoản.");
    }
    if (page <= 0 || limit <= 0) {
        throw new Error("Page và limit phải là số nguyên dương");
    }
    const skip = (page - 1)*limit;
    const transactions = await accountRepository.getTransactionBySenderId(accountId, skip, limit);
    transactions.totalPages = Math.ceil(transactions.totalCount/limit);
    return transactions;
}

const sendEmail = async (accountId, type, amount) => {
    try {
        const user = await accountRepository.findUserByAccountId(accountId);
        const balance = await getBalance(accountId);
        if (user?.email) {
            await emailService.sendTransactionEmail(user.email, type, amount, balance)
            .catch(err => console.error("Lỗi mail: ", err.message));;
        }
    } catch(error) {
        console.error("Lỗi trích xuất thông tin gửi mail:", error.message);
    }
};

module.exports = {
    getBalance,
    openBankAccount,
    depositMoney,
    withdrawMoney,
    transfer,
    getTransactions
}