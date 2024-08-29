import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb+srv://isaacMain:chimdindu1@nasacluster.zixrz.mongodb.net/?retryWrites=true&w=majority&appName=NASACluster')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
