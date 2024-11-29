import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Types } from 'mongoose';

export async function generateToken(
  res: Response,
  userId: Types.ObjectId,
  tokenName: string,
  jwtService: JwtService,
) {
  const token = jwtService.sign({ userId });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(tokenName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });
}