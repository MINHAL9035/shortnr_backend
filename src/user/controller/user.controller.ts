import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { UserRegistrationDto } from '../dto/user.registration';
import { UserService } from '../service/user.service';
import { Response } from 'express';
import { JwtUserGuard } from 'src/guards/jwtUserGuard';
import { LoginDto } from '../dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}
  @Post('register')
  async register(@Body() userDto: UserRegistrationDto, @Res() res: Response) {
    const user = await this._userService.registerUser(res, userDto);
    const { userName, image } = user;
    return res.status(201).json({ success: true, data: { userName, image } });
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this._userService.loginUser(loginDto, res);
    const { userName, image } = user;
    return res.status(201).json({ success: true, data: { userName, image } });
  }

  @UseGuards(JwtUserGuard)
  @Post('logOut')
  async logOut(@Res({ passthrough: true }) res: Response) {
    const response = await this._userService.logOut(res);
    return response;
  }
}
