import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userService = require('../services/user.service');
const userRepository = require('../repositories/user.repository');

describe('User Service (Authentication)', () => {

    // Cài đặt biến môi trường giả lập trước khi test
    beforeEach(() => {
        process.env.JWT_SECRET = 'test_secret_key';
    });

    // Dọn dẹp sau mỗi ca test
    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    // ==========================================
    // 1. TEST HÀM ĐĂNG KÝ (REGISTER)
    // ==========================================
    describe('Hàm registerUser', () => {
        it('Nên báo lỗi nếu email đã được đăng ký', async () => {
            // Giả lập DB trả về một user có thật
            vi.spyOn(userRepository, 'findUserByEmail').mockResolvedValue({ email: 'test@gmail.com' });

            await expect(userService.registerUser('Kha', 'test@gmail.com', '123456', 'USER'))
                .rejects
                .toThrow("Email này đã được sử dụng!");
        });

        it('Nên mã hóa mật khẩu và tạo user mới thành công', async () => {
            const mockUser = { id: 1, fullName: 'Kha', email: 'test@gmail.com', role: 'USER' };

            // Giả lập: Không tìm thấy email trùng lặp (hợp lệ để đăng ký)
            vi.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);
            
            // Giả lập thư viện bcrypt băm mật khẩu thành công
            vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password_123');
            
            // Giả lập DB tạo user
            vi.spyOn(userRepository, 'createUser').mockResolvedValue(mockUser);

            const result = await userService.registerUser('Kha', 'test@gmail.com', 'pass123', 'USER');

            // Đảm bảo mật khẩu được băm đủ 10 vòng (round = 10)
            expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10);
            
            // Đảm bảo DB được gọi với mật khẩu đã mã hóa chứ không phải mật khẩu gốc
            expect(userRepository.createUser).toHaveBeenCalledWith('Kha', 'test@gmail.com', 'hashed_password_123', 'USER');
            
            expect(result).toEqual(mockUser);
        });
    });

    // ==========================================
    // 2. TEST HÀM ĐĂNG NHẬP (LOGIN)
    // ==========================================
    describe('Hàm loginUser', () => {
        it('Nên báo lỗi nếu email không tồn tại trong DB', async () => {
            vi.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);

            await expect(userService.loginUser('wrong@gmail.com', '123456'))
                .rejects
                .toThrow("Sai thông tin đăng nhập");
        });

        it('Nên báo lỗi nếu mật khẩu không khớp', async () => {
            // Giả lập tìm thấy email, nhưng chuẩn bị giả lập bcrypt so sánh sai
            const mockUser = { id: 1, password: 'hashed_password_trong_db' };
            vi.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(mockUser);
            
            // Hàm compare trả về false nghĩa là sai mật khẩu
            vi.spyOn(bcrypt, 'compare').mockResolvedValue(false);

            await expect(userService.loginUser('test@gmail.com', 'wrong_pass'))
                .rejects
                .toThrow("Sai thông tin đăng nhập");
        });

        it('Nên đăng nhập thành công và trả về JWT Token', async () => {
            // Chuẩn bị dữ liệu user lấy từ DB (nhớ là code của bạn có .role.name)
            const mockUser = { 
                id: 'uuid_123', 
                email: 'test@gmail.com', 
                password: 'hashed_password',
                role: { name: 'ADMIN' }
            };
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

            vi.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(mockUser);
            
            // Hàm compare trả về true nghĩa là mật khẩu khớp
            vi.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            
            // Giả lập thư viện JWT sinh ra chuỗi token
            vi.spyOn(jwt, 'sign').mockReturnValue(mockToken); 

            const token = await userService.loginUser('test@gmail.com', 'correct_pass');

            // Đảm bảo bcrypt đã nhận đúng tham số để so sánh
            expect(bcrypt.compare).toHaveBeenCalledWith('correct_pass', 'hashed_password');
            
            // Đảm bảo JWT được cấp đúng payload và thời hạn 1 giờ
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'uuid_123', role: 'ADMIN' }, 
                'test_secret_key', 
                { expiresIn: '1h' }
            );
            
            expect(token).toBe(mockToken);
        });
    });
});