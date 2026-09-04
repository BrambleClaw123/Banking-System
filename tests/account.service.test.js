import { describe, it, expect, vi, afterEach } from 'vitest';

const accountService = require('../services/account.service');
const accountRepository = require('../repositories/account.repository');
const emailService = require('../services/email.service');

describe('Account Service', () => {

    // Chạy dọn dẹp sau MỖI ca test để dữ liệu giả không bị lẫn lộn
    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    // ==========================================
    // 1. TEST HÀM GET BALANCE
    // ==========================================
    describe('Hàm getBalance', () => {
        it('Nên báo lỗi nếu không tìm thấy tài khoản', async () => {
            vi.spyOn(accountRepository, 'findAccountById').mockResolvedValue(null);
            
            await expect(accountService.getBalance('invalid_id')).rejects.toThrow("Không tìm thấy tài khoản.");
        });

        it('Nên trả về số dư nếu tài khoản hợp lệ', async () => {
            vi.spyOn(accountRepository, 'findAccountById').mockResolvedValue({ balance: 500000 });
            
            const balance = await accountService.getBalance('valid_id');
            expect(balance).toBe(500000);
        });
    });

    // ==========================================
    // 2. TEST HÀM OPEN BANK ACCOUNT
    // ==========================================
    describe('Hàm openBankAccount', () => {
        it('Nên gọi repository để tạo tài khoản mới', async () => {
            const mockAccount = { id: 'acc_123', userId: 1, balance: 0 };
            vi.spyOn(accountRepository, 'createAccount').mockResolvedValue(mockAccount);

            const result = await accountService.openBankAccount(1);
            
            expect(accountRepository.createAccount).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockAccount);
        });
    });

    // ==========================================
    // 3. TEST HÀM DEPOSIT MONEY (Có gửi mail ngầm)
    // ==========================================
    describe('Hàm depositMoney', () => {
        it('Nên báo lỗi nếu số tiền nạp <= 0', async () => {
            await expect(accountService.depositMoney('acc_123', 0)).rejects.toThrow("Số tiền nạp phải là số dương khác 0");
        });

        it('Nên nạp tiền thành công và gọi hàm gửi email báo DEPOSIT', async () => {
            const mockUpdatedAccount = { id: 'acc_123', balance: 150000 };
            
            // Giả lập DB
            vi.spyOn(accountRepository, 'increaseBalance').mockResolvedValue(mockUpdatedAccount);
            vi.spyOn(accountRepository, 'findUserByAccountId').mockResolvedValue({ email: 'user@gmail.com' });
            vi.spyOn(accountRepository, 'findAccountById').mockResolvedValue({ balance: 150000 });
            vi.spyOn(emailService, 'sendTransactionEmail').mockResolvedValue(true);

            // Gọi hàm
            const result = await accountService.depositMoney('acc_123', 50000);

            // Kiểm tra DB
            expect(result).toEqual(mockUpdatedAccount);
            expect(accountRepository.increaseBalance).toHaveBeenCalledWith('acc_123', 50000);

            // Chờ tác vụ gửi mail ngầm chạy xong
            await new Promise((resolve) => setTimeout(resolve, 50));

            // Kiểm tra Email
            expect(emailService.sendTransactionEmail).toHaveBeenCalledWith('user@gmail.com', 'DEPOSIT', 50000, 150000);
        });
    });

    // ==========================================
    // 4. TEST HÀM WITHDRAW MONEY (Có gửi mail ngầm)
    // ==========================================
    describe('Hàm withdrawMoney', () => {
        it('Nên báo lỗi nếu số tiền rút <= 0', async () => {
            await expect(accountService.withdrawMoney('acc_123', -50000)).rejects.toThrow("Số tiền rút phải là số dương khác 0");
        });

        it('Nên rút tiền thành công và gọi hàm gửi email báo WITHDRAW', async () => {
            const mockUpdatedAccount = { id: 'acc_123', balance: 50000 };
            
            vi.spyOn(accountRepository, 'decreaseBalance').mockResolvedValue(mockUpdatedAccount);
            vi.spyOn(accountRepository, 'findUserByAccountId').mockResolvedValue({ email: 'user@gmail.com' });
            vi.spyOn(accountRepository, 'findAccountById').mockResolvedValue({ balance: 50000 });
            vi.spyOn(emailService, 'sendTransactionEmail').mockResolvedValue(true);

            const result = await accountService.withdrawMoney('acc_123', 100000);

            expect(result).toEqual(mockUpdatedAccount);
            expect(accountRepository.decreaseBalance).toHaveBeenCalledWith('acc_123', 100000);

            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(emailService.sendTransactionEmail).toHaveBeenCalledWith('user@gmail.com', 'WITHDRAW', 100000, 50000);
        });
    });

    // ==========================================
    // 5. TEST HÀM TRANSFER (Có gửi mail ngầm x2)
    // ==========================================
    describe('Hàm transfer', () => {
        it('Nên báo lỗi nếu số tiền chuyển <= 0', async () => {
            await expect(accountService.transfer('A', 'B', 0)).rejects.toThrow("Số tiền chuyển phải là số dương khác 0");
        });

        it('Nên báo lỗi nếu chuyển cho chính mình', async () => {
            await expect(accountService.transfer('A', 'A', 50000)).rejects.toThrow("Không thể chuyển tiền cho chính mình");
        });

        it('Nên chuyển tiền thành công và gửi đủ 2 email', async () => {
            const mockTransaction = { id: 1, amount: 50000, senderId: 'A', receiverId: 'B' };

            vi.spyOn(accountRepository, 'transferMoney').mockResolvedValue(mockTransaction);
            vi.spyOn(accountRepository, 'findUserByAccountId').mockResolvedValue({ email: 'test@gmail.com' });
            vi.spyOn(accountRepository, 'findAccountById').mockResolvedValue({ balance: 100000 });
            vi.spyOn(emailService, 'sendTransactionEmail').mockResolvedValue(true);

            const result = await accountService.transfer('A', 'B', 50000);

            expect(result).toEqual(mockTransaction);
            expect(accountRepository.transferMoney).toHaveBeenCalledWith('A', 'B', 50000);

            // Chờ cả 2 tác vụ gửi mail ngầm hoàn tất
            await new Promise((resolve) => setTimeout(resolve, 50));
            
            // Gửi 2 email: 1 cho người gửi, 1 cho người nhận
            expect(emailService.sendTransactionEmail).toHaveBeenCalledTimes(2);
        });
    });

    // ==========================================
    // 6. TEST HÀM GET TRANSACTIONS (Phân trang)
    // ==========================================
    describe('Hàm getTransactions', () => {
        it('Nên báo lỗi nếu không tìm thấy tài khoản', async () => {
            vi.spyOn(accountRepository, 'findAccountById').mockResolvedValue(null);
            await expect(accountService.getTransactions('invalid_id', 1, 10)).rejects.toThrow("Không tìm thấy tài khoản.");
        });

        it('Nên báo lỗi nếu page hoặc limit <= 0', async () => {
            vi.spyOn(accountRepository, 'findAccountById').mockResolvedValue({ id: 'valid_id' });
            await expect(accountService.getTransactions('valid_id', 0, 10)).rejects.toThrow("Page và limit phải là số nguyên dương");
            await expect(accountService.getTransactions('valid_id', 1, -5)).rejects.toThrow("Page và limit phải là số nguyên dương");
        });

        it('Nên trả về danh sách giao dịch kèm tổng số trang', async () => {
            vi.spyOn(accountRepository, 'findAccountById').mockResolvedValue({ id: 'valid_id' });
            
            // Giả lập DB trả về data phân trang
            const mockData = [ { id: 1 }, { id: 2 } ];
            mockData.totalCount = 15; // Tổng cộng 15 record
            
            vi.spyOn(accountRepository, 'getTransactionBySenderId').mockResolvedValue(mockData);

            const limit = 10;
            const page = 2;
            const skip = (page - 1) * limit; // = 10

            const result = await accountService.getTransactions('valid_id', page, limit);

            expect(accountRepository.getTransactionBySenderId).toHaveBeenCalledWith('valid_id', skip, limit);
            expect(result.length).toBe(2);
            expect(result.totalPages).toBe(2); // 15 / 10 làm tròn lên là 2
        });
    });
});