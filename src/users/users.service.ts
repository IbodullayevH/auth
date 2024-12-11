import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import * as bcryptjs from "bcryptjs"

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User) private readonly userModel: typeof User
  ) { }

  // user register
  async create(createUserDto: CreateUserDto): Promise<object> {
    try {
      const existUser = await this.userModel.findOne({ where: { email: createUserDto.email } })
      if (existUser) {
        throw new ConflictException('Already an existing user! Enter a different email address')
      }

      const [hashedPassword, newUser] = await Promise.all([
        bcryptjs.hash(createUserDto.password, 10),
        this.userModel.create(createUserDto)
      ])

      newUser.password = hashedPassword
      await newUser.save()
      const { password, ...result } = newUser.dataValues

      return result
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  // get all users data
  async findAll() {
    try {
      const allUsersData = await this.userModel.findAll({ include: { all: true } })

      return allUsersData.map(el => {
        const usersData = { ...el.toJSON() };
        delete usersData.password
        return usersData
      })

    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

}
