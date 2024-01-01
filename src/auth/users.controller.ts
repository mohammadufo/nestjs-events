import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDro } from './dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() body: CreateUserDro) {
    return this.authService.create(body);
  }
}
