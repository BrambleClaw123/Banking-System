const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendTransactionEmail = async (userEmail, type, amount, balance) => {
    try {
        let subject = '';
        let text = '';

        if (type === 'DEPOSIT') {
            subject = 'Thông báo: Nạp tiền thành công';
            text = `Tài khoản của bạn vừa được cộng +${amount} VNĐ. Số dư hiện tại: ${balance} VNĐ.`;
        } else if (type === 'WITHDRAW') {
            subject = 'Thông báo: Rút tiền thành công';
            text = `Tài khoản của bạn vừa bị trừ -${amount} VNĐ. Số dư hiện tại: ${balance} VNĐ.`;
        } else if (type === 'TRANSFER_SENT') {
            subject = 'Thông báo: Chuyển tiền thành công';
            text = `Bạn vừa chuyển thành công ${amount} VNĐ. Số dư hiện tại: ${balance} VNĐ.`;
        } else if (type === 'TRANSFER_RECIEVE') {
            subject = 'Thông báo: Nhận tiền thành công';
            text = `Bạn nhận tiền thành công ${amount} VNĐ. Số dư hiện tại: ${balance} VNĐ.`;
        }
        const mailOptions = {
            from: `"Core Banking System" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: subject,
            text: text
        };
        await transporter.sendMail(mailOptions);
        console.log(`[Email] Đã gửi thông báo ${type} tới ${userEmail}`);
    } catch (error) {
        console.error(`[Email Error] Lỗi gửi mail: ${error.message}`);
    }
};
module.exports = {
    sendTransactionEmail
};