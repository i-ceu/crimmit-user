import { Controller, Post, Body, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { RegisterPipe } from './validators/register/register.pipe';
import { LoginDto } from './dto/login.dto';
import { LoginPipe } from './validators/login/login.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(RegisterPipe) RegisterUserDto: RegisterUserDto, @Res() res: Response) {
    const user = await this.authService.register(RegisterUserDto);
    res.status(201).json({
      message: 'success',
      user,
    });
  }

  @Post('login')
  async login(@Body(LoginPipe) data: LoginDto, @Res() res: Response) {
    const credentials = await this.authService.login(data);
    res.status(200).json({
      message: 'success',
      credentials,
    });
  }
}
