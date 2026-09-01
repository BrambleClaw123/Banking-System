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
    if (amount <= 0) {
        throw new Error("Số tiền chuyển phải là số dương khác 0");
    }
    if (senderId === recieverId) {
        throw new Error("Không thể chuyển tiền cho chính mình");
    }
    const transaction = await accountRepository.transferMoney(senderId, recieverId, amount);

    try {
        const sender = await accountRepository.findUserByAccountId(senderId);
        const senderBalance = await getBalance(senderId);
        if (sender && sender.email) {
            emailService.sendTransactionEmail(sender.email, "TRANSFER_SENT", amount, senderBalance)
                .catch(err => console.error("Lỗi mail gửi:", err.message));
        }
        const receiver = await accountRepository.findUserByAccountId(recieverId);
        const receiverBalance = await getBalance(recieverId);
        if (receiver && receiver.email) {
            emailService.sendTransactionEmail(receiver.email, "TRANSFER_RECIEVE", amount, receiverBalance)
                .catch(err => console.error("Lỗi mail nhận:", err.message));
        }
    } catch (error) {
        console.error("Lỗi trích xuất thông tin gửi mail:", error.message);
    }

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