import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { PasswordService } from './utils/services/password.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL)
  ],
  controllers: [AppController],
  providers: [AppService, PasswordService, JwtService],
})
export class AppModule {}
