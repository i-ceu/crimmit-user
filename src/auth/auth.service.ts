import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { PasswordService } from '../utils/services/password.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) 
  private userModel: Model<UserDocument>,
  private readonly passwordService: PasswordService,
  private readonly jwtService: JwtService,
  private readonly userService: UserService
) {}

  async register(data: RegisterUserDto): Promise<User> {
    const hashedPassword = await this.passwordService.hashPassword(data.password);
    const createdUser = await this.userService.create({...data, password:hashedPassword});
    return createdUser;
  }

  async login(user){
    const accessToken = this.jwtService.sign(
      { id: user.id },
      { secret: process.env.JWT_SECRET },
    );

    return {
      user,
      accessToken,
    };

  }
}
