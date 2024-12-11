import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, notContains } from "class-validator";
import { UserRoles } from "../model/user.model";


export class CreateUserDto {
    @ApiProperty({
        example: 'Leo',
        description: 'Userning ismini stringda kiriting'
    })
    @IsString()
    @IsNotEmpty()
    first_name: string

    @ApiProperty({
        example: 'Messi',
        description: 'Userning familyasini stringda kiriting'
    })
    @IsString()
    @IsNotEmpty()
    last_name: string

    @ApiProperty({
        example: 'leo@example.com',
        description: 'Userning emaili stringda kiriting'
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        example: 'leo1235',
        description: 'Userning passwordini stringda kiriting'
    })
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({
        example: UserRoles.USER,
        description: 'Userni roli: USER yoki ADMIN'
    })
    @IsOptional()
    @IsEnum(UserRoles, {
        message: 'Role USER yoki ADMIN bo\'lishi kerak',
    })
    role?: UserRoles
}