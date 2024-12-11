import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from "@nestjs/sequelize"
import { User } from './users/model/user.model';
import { APP_GUARD } from '@nestjs/core';
import { VerifyRoleGuard } from './verify-role/verify-role.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      uri: process.env.DB_URL,
      models: [User],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: VerifyRoleGuard
  }],
})
export class AppModule { }
