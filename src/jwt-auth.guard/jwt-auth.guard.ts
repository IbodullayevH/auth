import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/model/user.model';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly secretKey: string;
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User) private readonly userModel: typeof User
  ) {
    this.secretKey = process.env.SECRET_KEY;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
   
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new NotFoundException(`Token topilmadi yoki noto'g'ri formatda! 🤷‍♂️`);
    }
    const token = authHeader.split(' ')[1];    
    try {
      const verifyUser = await this.jwtService.verifyAsync(token, { secret: this.secretKey });
      const user = await this.userModel.findOne({ where: { id: verifyUser.id } });
      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }      

      request.user = user;           
      return true;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new ForbiddenException('Token muddati tugagan');
      } else if (error.name === 'JsonWebTokenError') {
        throw new ForbiddenException('Notog\'ri token');
      } else {
        throw new ForbiddenException('Tokenni tasdiqlashda xatolik yuz berdi');
      }
    }
  }
}
