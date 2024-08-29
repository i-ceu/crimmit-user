import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { UserService } from 'src/users/user.service';

@Injectable()
export class RegisterPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: RegisterUserDto) {
    const user = await this.userService.findByEmail(value.email);
    const username = await this.userService.findByUsername(value.username);

    if (user) throw new BadRequestException('Email already exists');
    if (username) throw new BadRequestException('Username already exists');

    if (value.password !== value.confirmPassword)
      throw new BadRequestException('Password and Confirm password do not match');

    delete value.confirmPassword;
    return value;
  }
}
