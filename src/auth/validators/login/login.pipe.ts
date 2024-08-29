import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { User } from 'src/users/user.schema';
import { UserService } from 'src/users/user.service';
import { PasswordService } from 'src/utils/services/password.service';

@Injectable()
export class LoginPipe implements PipeTransform {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}
  async transform(value: LoginDto) {
    const user: User = await this.userService.findByEmail(value.email);

    if (!user) throw new BadRequestException('invalid login details');

    const passwordResult = await this.passwordService.decryptPassword(
      value.password,
      user.password,
    );

    if (!passwordResult) throw new BadRequestException('invalid login details');
    delete user.password;
    return user;
  }
}
