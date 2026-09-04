const accountService = require('../services/account.service')
const catchAsync = require('../utils/catchAsync')
const getAccountBalance = catchAsync(async (req, res) => {
    const accountId = req.params.id;

    const accountData = await accountService.getBalance(accountId);

    res.status(200).json({
        status: 'success',
        message: "Lấy số dư thành công",
        data: {
            balance: accountData
        }
    })
});

const create = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const newAccount = await accountService.openBankAccount(userId);
    res.status(201).json({
        status: "Created",
        messsage: "Tạo thành công tài khoản",
        data: newAccount
    });
})

const deposit = catchAsync(async (req, res) => {
    const accountId = req.body.id;
    const amount = req.body.amount;
    const parsedAmount = Number(amount);
    const updatedAccount = await accountService.depositMoney(accountId, parsedAmount);
    res.status(200).json({
        status: "Updated",
        message: "Nạp tiền thành công",
        data: updatedAccount
    })
});

const withdraw = catchAsync(async (req, res) => {
    const accountId = req.body.id;
    const amount = req.body.amount;
    const parsedAmount = Number(amount);
    const updatedAccount = await accountService.withdrawMoney(accountId, parsedAmount);
    res.status(200).json({
        status: "Updated",
        message: "Rút tiền thành công",
        data: updatedAccount
    })
});

const transfer = catchAsync(async (req, res) => {
    const { senderId, recieverId, amount } = req.body;
    const parsedAmount = Number(amount);

    const transaction = await accountService.transfer(senderId, recieverId, parsedAmount);

    res.status(200).json({
        status: "success",
        message: "Chuyển tiền thành công",
        data: transaction
    })
});

const getTransactions = catchAsync(async (req, res) => {
    const accountId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const transactions = await accountService.getTransactions(accountId, page, limit);
    res.status(200).json({
        status: "success",
        message: "Lấy các giao dịch thành công",
        data: transactions
    })
});
module.exports = {
    getAccountBalance,
    create,
    deposit,
    withdraw,
    transfer,
    getTransactions
}