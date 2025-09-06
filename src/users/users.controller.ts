import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { customInterceptorSerialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
@customInterceptorSerialize(UserDto)
export class UsersController {
  constructor(private readonly userService: UsersService) {
  }
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body.email, body.password);
  }

  @Get('/:id')
  findUserById(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }
}
