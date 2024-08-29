import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async decryptPassword(
    providedPassword: string,
    savedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(providedPassword, savedPassword);
  }
}
