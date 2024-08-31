import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterPipe } from './validators/register/register.pipe';
import { LoginPipe } from './validators/login/login.pipe';
import { UserService } from '../users/user.service';
import { PasswordService } from '../utils/services/password.service';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';


describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let passwordService: PasswordService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };
  const mockUserService = {
    create:jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const mockPasswordService = {
    hashPassword: jest.fn(),
    decryptPassword: jest.fn(),
  };

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        
        {
          provide: UserService,
          useValue: mockUserService,
        },

        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },

      ],
    })
      .overrideProvider(RegisterPipe)
      .useValue({
        transform: jest.fn().mockImplementation((value) => value),
      })
      .overrideProvider(LoginPipe)
      .useValue({
        transform: jest.fn().mockImplementation((value) => value),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerUserDto: RegisterUserDto = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const mockUser = { id: '1', ...registerUserDto };

      mockAuthService.register.mockResolvedValue(mockUser);
      const response = mockResponse();

      await controller.register(registerUserDto, response);

      expect(authService.register).toHaveBeenCalledWith(registerUserDto);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith({
        message: 'success',
        user: mockUser,
      });
    });

    it('should throw an error if registration fails', async () => {
      const registerUserDto: RegisterUserDto = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password12',

      };

      mockAuthService.register.mockRejectedValue(new Error('Registration failed'));
      const response = mockResponse();

      await expect(controller.register(registerUserDto, response)).rejects.toThrow('Registration failed');
    });
    it('should throw an error if passwords do not match', async () => {
      const registerUserDto: RegisterUserDto = {
        name:"test user",
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
      };

      mockAuthService.register.mockRejectedValue(new BadRequestException('Passwords do not match'));
      const response = mockResponse();

      await expect(controller.register(registerUserDto, response)).rejects.toThrow(BadRequestException);
      await expect(controller.register(registerUserDto, response)).rejects.toThrow('Passwords do not match');
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerUserDto: RegisterUserDto = {
        name:"test user",
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      mockAuthService.register.mockRejectedValue(new BadRequestException('Email already exists'));
      const response = mockResponse();

      await expect(controller.register(registerUserDto, response)).rejects.toThrow(BadRequestException);
      await expect(controller.register(registerUserDto, response)).rejects.toThrow('Email already exists');
    });

    it('should throw an error if username already exists', async () => {
      const registerUserDto: RegisterUserDto = {
        name:"test user",
        username: 'existinguser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      mockAuthService.register.mockRejectedValue(new BadRequestException('Username already exists'));
      const response = mockResponse();

      await expect(controller.register(registerUserDto, response)).rejects.toThrow(BadRequestException);
      await expect(controller.register(registerUserDto, response)).rejects.toThrow('Username already exists');
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockCredentials = { accessToken: 'mock-token' };

      mockAuthService.login.mockResolvedValue(mockCredentials);
      const response = mockResponse();

      await controller.login(loginDto, response);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'success',
        credentials: mockCredentials,
      });
    });

    it('should throw an error if password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));
      const response = mockResponse();

      await expect(controller.login(loginDto, response)).rejects.toThrow(UnauthorizedException);
      await expect(controller.login(loginDto, response)).rejects.toThrow('Invalid credentials');
    });
  });
});