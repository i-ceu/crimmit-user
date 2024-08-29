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
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MaxLength(100)
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message:
            'Password must contain at least one uppercase, one lowercase and one number',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirmPassword: string;

}