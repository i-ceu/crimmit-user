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

    if (user) throw new BadRequestException('email already exists');
    if (username) throw new BadRequestException('username already exists');

    if (value.password !== value.confirmPassword)
      throw new BadRequestException('password does not match');

    delete value.confirmPassword;
    return value;
  }
}
