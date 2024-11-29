import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { Model } from 'mongoose';
import { UserInterface } from '../interface/user.interface';
import { UserRegistrationDto } from '../dto/user.registration';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private _userModel: Model<User>,
  ) {}

  async findByEmail(email: string): Promise<UserInterface> {
    return await this._userModel.findOne({ email }).exec();
  }

  async createUser(userDetails: UserRegistrationDto): Promise<User> {
    const newUser = new this._userModel(userDetails);
    return await newUser.save();
  }
}
