import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth';
import { User } from './user.schema';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = [{
        id: '1', 
        name: "test user",
        username: "tester",
        email: 'test@example.com',
      }];
      mockUserService.findAll.mockResolvedValue(result);
      const response = mockResponse();

      await controller.findAll(response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'All users retrieved successfully',
        users: result,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = {
        id: '1', 
        name: "test user",
        username: "tester",
        email: 'test@example.com',
      };
      mockUserService.findOne.mockResolvedValue(result);
      const response = mockResponse();

      await controller.findOne('1', response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'User details retrieved succesfully',
        user: result,
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: Partial<User> = { name: 'Jane Doe' };
      const result = {
        id: '1', 
        name: "Jane Doe",
        username: "tester",
        email: 'test@example.com',
      };
      mockUserService.update.mockResolvedValue(result);
      const response = mockResponse();

      await controller.update('1', updateUserDto, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'User details updated succesfully',
        updatedUser: result,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const response = mockResponse();
      await controller.remove('1', response);

      expect(mockUserService.remove).toHaveBeenCalledWith('1');
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        message: 'User deleted succesfully',
      });
    });
  });
});