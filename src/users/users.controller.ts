import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Session,
  Req,
} from '@nestjs/common';
import { customInterceptorSerialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto, UserDto } from './dtos';
import { UsersService } from './users.service';

@Controller('auth')
@customInterceptorSerialize(UserDto)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id.toString();

    return user;
  }

  @Post('/signin')
  async signIn(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id.toString();

    return user;
  }

  @Get('/whoami')
  whoAmI(@Session() session: any) {
    return this.userService.findOne(parseInt(session.userId));
  }

  @Get('/:id')
  findUserById(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }
}
