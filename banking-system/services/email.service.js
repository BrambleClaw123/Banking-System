const nodemailer = require('nodemailer');
const templates = require('../utils/emailTemplate')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendTransactionEmail = async (userEmail, type, amount, balance) => {
    try {
        let {subject, text} = templates(amount, balance)[type];
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