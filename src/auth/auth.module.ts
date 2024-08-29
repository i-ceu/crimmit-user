import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/users/user.service';
import { UserController } from 'src/users/user.controller';
import { User, UserSchema } from 'src/users/user.schema';
import { PasswordService } from 'src/utils/services/password.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService,PasswordService,JwtStrategy],
  exports: [UserService],
})
export class AuthModule {}
