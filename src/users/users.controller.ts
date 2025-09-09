import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { customInterceptorSerialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos';
import { UserDto } from './dtos';
import { UsersService } from './users.service';

@Controller('auth')
@customInterceptorSerialize(UserDto)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  signIn(@Body() body: CreateUserDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @Get('/:id')
  findUserById(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }
}
