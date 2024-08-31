import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.schema';
import { PasswordService } from '../utils/services/password.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { Model } from 'mongoose';
import { UserService } from '../users/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<UserDocument>;
  let passwordService: PasswordService;
  let jwtService: JwtService;
  let userService: UserService;

  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockPasswordService = {
    hashPassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    passwordService = module.get<PasswordService>(PasswordService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and create a new user', async () => {
      const registerDto: RegisterUserDto = {
        name: "test user",
        username: "tester",
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: 'some-id',
        email: 'test@example.com',
        name: "test user",
        username: "tester",
      };

      mockPasswordService.hashPassword.mockResolvedValue(hashedPassword);
      mockUserService.create.mockResolvedValue(createdUser);
      const result = await service.register(registerDto);
      expect(passwordService.hashPassword).toHaveBeenCalledWith(registerDto.password);

      expect(userService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('login', () => {
    it('should generate and return access token with user', async () => {
      const user = {
        id: '123',
        email: 'test@example.com',
        name: "test user",
        username: "tester",
      };
      const accessToken = 'generatedAccessToken';

      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: user.id },
        { secret: process.env.JWT_SECRET }
      );
      expect(result).toEqual({
        user,
        accessToken,
      });
    });
  });
});