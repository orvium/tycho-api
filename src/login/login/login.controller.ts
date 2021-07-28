import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDataDto } from 'src/dtos/login-data/login-data.dto';
import { LoginService } from './login.service';

@ApiTags('login')
@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  /**
   * Login with email and password
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDataDto) {
    return this.loginService.login(loginDto);
  }
}
