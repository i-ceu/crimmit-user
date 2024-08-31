import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { PasswordService } from '../utils/services/password.service';

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDocument>;

  const mockUser = {
    id: 'a-mock-id',
    name: "test user",
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
  };

  const mockPasswordService = {
    hashPassword: jest.fn(),
  };

  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const registerDto: RegisterUserDto = {
        name: "test user",
        username: "tester",
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const createdUser = {
        id: 'some-id',
        ...registerDto,
      };
      
      mockUserModel.create.mockResolvedValue(createdUser);

      const result = await service.create(registerDto);

      expect(mockUserModel.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockUser]),
      } as any);
      const users = await service.findAll();
      expect(users).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);
      const user = await service.findOne('a-mock-id');
      expect(user).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);
      const user = await service.findByEmail('test@example.com');
      expect(user).toEqual(mockUser);
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);
      const user = await service.findByUsername('testuser');
      expect(user).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const updatedUser = { ...mockUser, username: 'updateduser' };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedUser),
      } as any);
      const user = await service.update('a-mock-id', { username: 'updateduser' });
      expect(user).toEqual(updatedUser);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith('a-mock-id', { username: 'updateduser' }, { new: true });
    });
  });

  describe('remove', () => {
    it('should remove and return a user', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);
      const user = await service.remove('a-mock-id');
      expect(user).toEqual(mockUser);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('a-mock-id');
    });
  });
});