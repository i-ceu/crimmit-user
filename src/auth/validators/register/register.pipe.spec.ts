import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { RegisterPipe } from './register.pipe';
import { UserService } from '../../../users/user.service';
import { RegisterUserDto } from '../../../auth/dto/register-user.dto';

describe('RegisterPipe', () => {
    let pipe: RegisterPipe;
    let userService: UserService;

    const mockUserService = {
        findByEmail: jest.fn(),
        findByUsername: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegisterPipe,
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        pipe = module.get<RegisterPipe>(RegisterPipe);
        userService = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(pipe).toBeDefined();
    });

    describe('transform', () => {
        const validRegisterDto: RegisterUserDto = {
            name: "test user",
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
            confirmPassword: 'password123',
        };

        it('should return RegisterUserDto without confirmPassword for valid input', async () => {
            mockUserService.findByEmail.mockResolvedValue(null);
            mockUserService.findByUsername.mockResolvedValue(null);

            const result = await pipe.transform(validRegisterDto);

            expect(result).toEqual({
                name:"test user",
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
            });
            expect(result.confirmPassword).toBeUndefined();
        });

        it('should throw BadRequestException if email already exists', async () => {
            mockUserService.findByEmail.mockResolvedValue({ id: '1', email: 'test@example.com' });
            mockUserService.findByUsername.mockResolvedValue(null);

            await expect(pipe.transform(validRegisterDto)).rejects.toThrow(BadRequestException);
            await expect(pipe.transform(validRegisterDto)).rejects.toThrow('Email already exists');
        });

        it('should throw BadRequestException if username already exists', async () => {
            mockUserService.findByEmail.mockResolvedValue(null);
            mockUserService.findByUsername.mockResolvedValue({ id: '1', username: 'testuser' });

            await expect(pipe.transform(validRegisterDto)).rejects.toThrow(BadRequestException);
            await expect(pipe.transform(validRegisterDto)).rejects.toThrow('Username already exists');
        });

        it('should throw BadRequestException if password and confirmPassword do not match', async () => {
            mockUserService.findByEmail.mockResolvedValue(null);
            mockUserService.findByUsername.mockResolvedValue(null);

            const invalidDto = { ...validRegisterDto, confirmPassword: 'differentpassword' };

            await expect(pipe.transform(invalidDto)).rejects.toThrow(BadRequestException);
            await expect(pipe.transform(invalidDto)).rejects.toThrow('Password and Confirm password do not match');
        });
    });
});