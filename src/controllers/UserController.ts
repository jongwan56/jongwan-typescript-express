import {
  JsonController,
  Get,
  Body,
  Post,
  CurrentUser,
  Authorized,
  HttpCode,
  Patch,
} from "routing-controllers";
import { UserService } from "../services/UserService";
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  RefreshAccessTokenDto,
  UserResponseDto,
  UserTokenResponseDto,
} from "../dtos/UserDto";
import { UserNotFoundError } from "../errors/UserError";
import { User } from "../entities/User";

@JsonController("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(201)
  public async register(@Body() createUserDto: CreateUserDto): Promise<UserTokenResponseDto> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.generateAndSaveTokens(user);
  }

  @Post("/login")
  public async login(@Body() loginUserDto: LoginUserDto): Promise<UserTokenResponseDto> {
    const user = await this.userService.getUserByEmailAndPassword(loginUserDto);

    if (user) {
      return this.userService.generateAndSaveTokens(user);
    }

    throw new UserNotFoundError();
  }

  @Get("/me")
  @Authorized()
  public getCurrentUser(@CurrentUser() user: User): UserResponseDto {
    return user.toResponseDto();
  }

  @Patch("/me")
  @Authorized()
  public async updateCurrentUser(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return (await this.userService.updateUser(user, updateUserDto)).toResponseDto();
  }

  @Post("/token")
  public async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto
  ): Promise<UserTokenResponseDto> {
    const user = await this.userService.getUserByRefreshToken(refreshAccessTokenDto);

    if (user) {
      return this.userService.generateAndSaveTokens(user);
    }

    throw new UserNotFoundError();
  }
}
