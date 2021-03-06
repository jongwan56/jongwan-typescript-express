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
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
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
  @ResponseSchema(UserTokenResponseDto)
  public async register(@Body() createUserDto: CreateUserDto): Promise<UserTokenResponseDto> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.generateAndSaveTokens(user);
  }

  @Post("/login")
  @ResponseSchema(UserTokenResponseDto)
  public async login(@Body() loginUserDto: LoginUserDto): Promise<UserTokenResponseDto> {
    const user = await this.userService.getUserByEmailAndPassword(loginUserDto);

    if (user) {
      return this.userService.generateAndSaveTokens(user);
    }

    throw new UserNotFoundError();
  }

  @Get("/me")
  @Authorized()
  @ResponseSchema(UserResponseDto)
  @OpenAPI({ security: [{ bearerAuth: [] }] })
  public getCurrentUser(@CurrentUser() user: User): UserResponseDto {
    return user.toResponseDto();
  }

  @Patch("/me")
  @Authorized()
  @ResponseSchema(UserResponseDto)
  @OpenAPI({ security: [{ bearerAuth: [] }] })
  public async updateCurrentUser(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return (await this.userService.updateUser(user, updateUserDto)).toResponseDto();
  }

  @Post("/token")
  @ResponseSchema(UserTokenResponseDto)
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
