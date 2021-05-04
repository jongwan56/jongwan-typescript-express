import { IsNotEmpty, Length, IsEmail, Matches, IsOptional, IsUUID } from "class-validator";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,}$/;

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 30)
  name!: string;

  @IsNotEmpty()
  @Length(1, 100)
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Length(8, 100)
  @Matches(PASSWORD_REGEX)
  password!: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @Length(1, 100)
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Length(8, 100)
  @Matches(PASSWORD_REGEX)
  password!: string;
}

export class UpdateUserDto {
  @IsOptional()
  @Length(1, 30)
  name?: string;

  @IsOptional()
  @Length(1, 100)
  @IsEmail()
  email?: string;

  @IsOptional()
  @Length(8, 100)
  @Matches(PASSWORD_REGEX)
  password?: string;
}

export class RefreshAccessTokenDto {
  @IsNotEmpty()
  refreshToken!: string;
}

export class UserResponseDto {
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @IsNotEmpty()
  @Length(1, 30)
  name!: string;

  @IsNotEmpty()
  @Length(1, 100)
  @IsEmail()
  email!: string;
}

export class UserTokenResponseDto {
  @IsNotEmpty()
  accessToken!: string;

  @IsNotEmpty()
  refreshToken!: string;
}
