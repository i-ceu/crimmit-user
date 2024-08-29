import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { User } from 'src/users/user.schema';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService
      ],
      imports: [
        
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return user object', async () => {
      const user = { name: 'guy boss', username: "guyb", email: 'newuser', password: 'newPass1', confirmPassword: 'newPass1', };
      const createdUser = { ...user, _id: '1' };
      jest.spyOn(authService, 'register').mockResolvedValue(createdUser);
      const result = await authService.register(user);
      expect(result).toEqual({ id: '1', username: 'newuser', name: "guy boss", email: 'newuser', password: 'newPass1' });
    });
  });

  // describe('login', () => {
  //   it('should return JWT token when credentials are valid', async () => {
  //     const user = { username: 'testuser', id: '1' };
  //     jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

  //     const result = await authService.login(user);
  //     expect(result).toEqual({ access_token: 'test-token' });
  //     expect(jwtService.sign).toHaveBeenCalledWith({ username: 'testuser', sub: '1' });
  //   });
  // });
});

