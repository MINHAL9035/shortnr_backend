import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UserRegistrationDto } from '../dto/user.registration';
import { Response } from 'express';
import { generateToken } from '../utils/generateTokens';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

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
}
