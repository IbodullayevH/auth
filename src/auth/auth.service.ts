import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/model/user.model';
import * as bcryptjs from "bcryptjs"

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
        @InjectModel(User) private readonly userModel: typeof User
    ) { }

    async generateToken(user: User): Promise<object> {
        try {
            const payload = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            };

            const [access_token, refresh_token] = await Promise.all([
                this.jwtService.signAsync(payload, {
                    secret: process.env.SECRET_KEY,
                    expiresIn: process.env.ACCESS_TOKEN_TIME
                }),

                this.jwtService.signAsync(payload, {
                    secret: process.env.SECRET_KEY,
                    expiresIn: process.env.REFRESH_TOKEN_TIME
                })
            ])

            return {
                access_token,
                refresh_token
            }
        } catch (error: any) {
            throw new InternalServerErrorException('Token generatsiya qilishda xatolik')
        }

    }


    // refresh token bn acces tokenni yangilash
    async updateAccestoken(refresh_token: string) {

    }

    async validateUser(loginDto: LoginDto): Promise<any> {
        try {
            const user = await this.userModel.findOne({ where: { email: loginDto.email } })

            if (!user) {
                throw new NotFoundException('User not found')
            }
            const isPasswordValid = await bcryptjs.compare(loginDto.password, user.password)

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid password');
            }
            return user
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }
}
