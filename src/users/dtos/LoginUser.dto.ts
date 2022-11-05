import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsNotEmpty()
    @IsEmail()
    username: string;
}