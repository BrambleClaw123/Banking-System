const accountRepository = require('../repositories/account.repository');
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
    const account = await accountRepository.findAccountById(accountId);
    if (!account) {
        throw new Error("Không tìm thấy tài khoản.");
    }
    const updatedAccount = await accountRepository.increaseBalance(accountId,amount);
    return updatedAccount;
}

const withdrawMoney = async (accountId, amount) => {
    if (amount <= 0) {
        throw new Error("Số tiền rút phải là số dương khác 0");
    }
    const account = await accountRepository.findAccountById(accountId);
    if (!account) {
        throw new Error("Không tìm thấy tài khoản.");
    }
    if (account.balance < amount) {
        throw new Error("Số dư không đủ để thực hiện giao dịch");
    }
    const updatedAccount = await accountRepository.decreaseBalance(accountId, amount);
    return updatedAccount;
}

const openBankAccount = async (userId) => {
    return accountRepository.createAccount(userId);
};

const transfer = async (senderId, recieverId, amount) => {
    const sender = await accountRepository.findAccountById(senderId);
    const receiver = await accountRepository.findAccountById(recieverId);
    if (!sender) {
        throw new Error("Không tìm thấy tài khoản gửi.");
    }
    if (!receiver) {
        throw new Error("Không tìm thấy tài khoản nhận.");
    }
    if (sender.balance < amount) {
        throw new Error("Số dư không đủ để thực hiện giao dịch");
    }
    if (amount <= 0) {
        throw new Error("Số tiền chuyển phải là số dương khác 0");
    }
    const transaction = await accountRepository.transferMoney(senderId, recieverId, amount);
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

module.exports = {
    getBalance,
    openBankAccount,
    depositMoney,
    withdrawMoney,
    transfer,
    getTransactions
}