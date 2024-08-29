import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { PasswordService } from '../utils/services/password.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) 
  private userModel: Model<UserDocument>,
  private readonly passwordService: PasswordService,
  private readonly jwtService: JwtService,
) {}

  async register(data: RegisterUserDto): Promise<User> {
    data.password = await this.passwordService.hashPassword(data.password);
    const createdUser = new this.userModel(data);
    return createdUser.save();
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
