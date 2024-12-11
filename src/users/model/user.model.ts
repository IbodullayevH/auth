import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

export enum UserRoles {
    ADMIN = `admin`,
    USER = `user`
}

export interface IUser {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string
}

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User, IUser> {
    @ApiProperty({
        example: 1,
        description: 'Foydalanuvchi ID raqami',
    })
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @ApiProperty({
        example: `Leo`,
        description: 'Userning ismini stringda kiriting'
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    first_name: string

    @ApiProperty({
        example: `Messi`,
        description: `Userning familyasini stringda kiriting`
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    last_name: string

    @ApiProperty({
        example: 'user@example.com',
        description: 'Userning email manzili',
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email: string;

    @ApiProperty({
        example: 'leo123',
        description: 'Userning paroli',
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @ApiProperty({
        example: UserRoles.USER,
        description: `Userni roli: User yoki admin. Default user`
    })
    @Column({
        type: DataType.ENUM(...Object.values(UserRoles)),
        allowNull: false,
        defaultValue: UserRoles.USER
    })
    role: UserRoles

};

