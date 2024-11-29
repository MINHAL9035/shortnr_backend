import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UserRegistrationDto } from '../dto/user.registration';
import { Response } from 'express';
import { clearTokenCookies, generateToken } from '../utils/generateTokens';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { LoginDto } from '../dto/login.dto';
import { ILogin } from '../interface/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(@Res() res: Response, userDetails: UserRegistrationDto) {
    try {
      const existingVerifiedUser = await this._userRepository.findByEmail(
        userDetails.email,
      );
      if (existingVerifiedUser) {
        throw new ConflictException('A user with this email already exists');
      }
      const user = await this._userRepository.createUser(userDetails);
      console.log('userID', typeof user._id);

      if (user) {
        generateToken(
          res,
          user._id as Types.ObjectId,
          'userJwt',
          this.jwtService,
        );
      }

      return user;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(
        'An error occurred while registering the user.',
      );
    }
  }

  async loginUser(LoginDto: LoginDto, res: Response): Promise<ILogin> {
    try {
      const { password } = LoginDto;

      const user = await this._userRepository.findUser(LoginDto);
      console.log('my user', user);

      if (!user) {
        throw new UnauthorizedException('You are not a user, please sign up');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Incorrect Password');
      }
      if (user) {
        generateToken(
          res,
          user._id as Types.ObjectId,
          'userJwt',
          this.jwtService,
        );
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async logOut(res: Response): Promise<{ message: string }> {
    try {
      clearTokenCookies(res);
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw error;
    }
  }
}
