import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  generateToken(@Body() body: UserLoginDto): any {
    return this.authService.login(body);
  }
}
