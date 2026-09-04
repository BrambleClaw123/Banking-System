const templates = (amount, balance) => {
    return {
        DEPOSIT: {
            subject: 'Thông báo: Nạp tiền thành công',
            text: `Tài khoản của bạn vừa được cộng +${amount} VNĐ.\nSố dư hiện tại: ${balance} VNĐ.`
        },
        WITHDRAW: {
            subject: 'Thông báo: Rút tiền thành công',
            text: `Tài khoản của bạn vừa bị trừ -${amount} VNĐ.\nSố dư hiện tại: ${balance} VNĐ.`
        },
        TRANSFER_SENT: {
            subject: 'Thông báo: Chuyển tiền thành công',
            text: `Bạn vừa chuyển ${amount} VNĐ.\nSố dư hiện tại: ${balance} VNĐ.`
        },
        TRANSFER_RECEIVE: {
            subject: 'Thông báo: Nhận tiền thành công',
            text: `Bạn vừa nhận ${amount} VNĐ.\nSố dư hiện tại: ${balance} VNĐ.`
        }
    }
};

module.exports = templates;