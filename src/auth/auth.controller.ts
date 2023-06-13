import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  generateToken(@Body() body: UserLoginDto, @Res() res: Response): any {
    return this.authService.login(body).then((response) => {
      const days_90 = 90 * 24 * 60 * 60 * 1000;
      res
        .status(200)
        .cookie('token', response.token, {
          expires: new Date(Date.now() + days_90),
          httpOnly: true,
          secure: true,
          domain: 'app.jarvis-opt.com',
        })
        .json({
          success: true,
          message: 'LogIn Successfully',
        });
    });
  }
}
