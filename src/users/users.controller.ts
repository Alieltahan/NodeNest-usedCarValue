import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Session,
  Req,
} from '@nestjs/common';
import expressSession from 'express-session';
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
    @Session() session: expressSession.SessionData,
  ) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id.toString();

    return user;
  }

  @Post('/signin')
  async signIn(
      @Req() request: express.Request,
    @Body() body: CreateUserDto,
    @Session() session: expressSession.SessionData,
  ) {
    const user = await this.authService.signIn(body.email, body.password);
    request.session.userId = user.id.toString();

    return { ...user, session: request.session };
  }

  @Get('/:id')
  findUserById(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Get('/whoami')
  whoAmI(@Session() session: expressSession.SessionData) {
    console.debug('\x1b[38;5;214m', 'OR Zxx session.userId', session.userId, '\x1b[0m');
return 'This is it...' + session.userId;
  }

  @Get('/abc')
  whoAm() {
    return '123'
  }

  @Get('/new')
    newRoute() {
        return 'new route'
    }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }
}
