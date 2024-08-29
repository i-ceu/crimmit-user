import {
    IsString,
    IsEmail,
    MinLength,
    Matches,
    MaxLength,
    IsNotEmpty,

} from 'class-validator';

export class RegisterUserDto {
    @IsString()
    @MinLength(4)
    name: string;

    @IsString()
    @MinLength(4)
    username: string;

    @IsEmail()
    email: string;

    @MaxLength(100)
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message:
            'password must contain at least one uppercase, one lowercase and one number',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirmPassword: string;

}