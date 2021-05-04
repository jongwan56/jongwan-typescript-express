import { Request } from "express";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import {
  CreateUserDto,
  LoginUserDto,
  RefreshAccessTokenDto,
  UpdateUserDto,
  UserTokenResponseDto,
} from "../dtos/UserDto";
import { env } from "../env";
import {
  DuplicateEmailError,
  AccessTokenExpiredError,
  RefreshTokenExpiredError,
} from "../errors/UserError";

@Service()
export class UserService {
  constructor(
    @InjectRepository()
    private userRepository: UserRepository
  ) {}

  public async createUser({ name, email, password }: CreateUserDto): Promise<User> {
    const user = new User();

    user.name = name;
    user.email = email;
    user.password = password;

    try {
      return await this.userRepository.save(user);
    } catch {
      throw new DuplicateEmailError();
    }
  }

  public async getUserByEmailAndPassword({
    email,
    password,
  }: LoginUserDto): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ email });

    if (await user?.comparePassword(password)) {
      return user;
    }
  }

  public async getUserFromRequest(req: Request): Promise<User | undefined> {
    const auth = req.headers.authorization?.split(" ");
    const token = auth && auth[0] === "Bearer" ? auth[1] : "";

    try {
      const { userId } = jwt.verify(token, env.jwt.accessSecretKey) as { userId: string };
      return await this.userRepository.findOne(userId);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AccessTokenExpiredError();
      }
    }
  }

  public async getUserByRefreshToken({
    refreshToken,
  }: RefreshAccessTokenDto): Promise<User | undefined> {
    try {
      const { userId } = jwt.verify(refreshToken, env.jwt.refreshSecretKey) as {
        userId: string;
      };
      return await this.userRepository.findOne({ id: userId, refreshToken });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new RefreshTokenExpiredError();
      }
    }
  }

  public async updateUser(user: User, { name, email, password }: UpdateUserDto): Promise<User> {
    if (email) {
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = password;
      await user.hashPassword();
    }

    return await this.userRepository.save(user);
  }

  public async generateAndSaveTokens(user: User): Promise<UserTokenResponseDto> {
    const payload = { userId: user.id };

    const accessToken = jwt.sign(payload, env.jwt.accessSecretKey, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, env.jwt.refreshSecretKey, { expiresIn: "30d" });

    user.refreshToken = refreshToken;

    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }
}
