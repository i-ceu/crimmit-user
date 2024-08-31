import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { LoginPipe } from './login.pipe';
import { UserService } from '../../../users/user.service';
import { PasswordService } from '../../../utils/services/password.service';
import { LoginDto } from '../../../auth/dto/login.dto';
import { User } from '../../../users/user.schema';

describe('LoginPipe', () => {
    let pipe: LoginPipe;
    let userService: UserService;
    let passwordService: PasswordService;

    const mockUserService = {
        findByEmail: jest.fn(),
    };

    const mockPasswordService = {
        decryptPassword: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginPipe,
                { provide: UserService, useValue: mockUserService },
                { provide: PasswordService, useValue: mockPasswordService },
            ],
        }).compile();

        pipe = module.get<LoginPipe>(LoginPipe);
        userService = module.get<UserService>(UserService);
        passwordService = module.get<PasswordService>(PasswordService);
    });

    it('should be defined', () => {
        expect(pipe).toBeDefined();
    });

    describe('transform', () => {
        const loginDto: LoginDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should return user without password for valid credentials', async () => {
            const user: User = {
                _id: "some-id",
                name: "test user",
                username: "tester",
                email: 'test@example.com',
                password: 'hashedPassword',
            };

            mockUserService.findByEmail.mockResolvedValue(user);
            mockPasswordService.decryptPassword.mockResolvedValue(true);

            const result = await pipe.transform(loginDto);

            expect(result).toEqual({
                _id: "some-id",
                name: "test user",
                username: "tester",
                email: 'test@example.com',
            });
        });

        it('should throw BadRequestException if user is not found', async () => {
            mockUserService.findByEmail.mockResolvedValue(null);

            await expect(pipe.transform(loginDto)).rejects.toThrow(BadRequestException);
            await expect(pipe.transform(loginDto)).rejects.toThrow('invalid login details');
        });

        it('should throw BadRequestException if password is incorrect', async () => {
            const user: User = {
                _id: "some-id",
                name: "test user",
                username: "tester",
                email: 'test@example.com',
                password: 'hashedPassword',
            };

            mockUserService.findByEmail.mockResolvedValue(user);
            mockPasswordService.decryptPassword.mockResolvedValue(false);

            await expect(pipe.transform(loginDto)).rejects.toThrow(BadRequestException);
            await expect(pipe.transform(loginDto)).rejects.toThrow('invalid login details');
        });
    });
});