import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({
        example: 'email',
        description: 'emailni kiriting'
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        example: 'password',
        description: 'passwordni kiriting'
    })
    @IsString()
    @IsNotEmpty()
    password: string
}
