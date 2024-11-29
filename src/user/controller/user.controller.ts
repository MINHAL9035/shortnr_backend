import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserRegistrationDto } from '../dto/user.registration';
import { UserService } from '../service/user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}
  @Post('register')
  async register(@Body() userDto: UserRegistrationDto, @Res() res: Response) {
    const user = await this._userService.registerUser(res, userDto);
    return res.status(HttpStatus.CREATED).json({
      userName: user.userName,
      image: user.image,
    });
  }
}
