import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService

  ) { }

  @Post('login')
  async userRegister(@Body() loginDto: LoginDto): Promise<object> {
    try {
      const user = await this.authService.validateUser(loginDto)
      return await this.authService.generateToken(user)
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}

