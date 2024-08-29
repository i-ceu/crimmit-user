import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/users/user.service';
import { PasswordService } from 'src/utils/services/password.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AuthService, UserService, PasswordService, JwtStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to the user management system');
  });
});
