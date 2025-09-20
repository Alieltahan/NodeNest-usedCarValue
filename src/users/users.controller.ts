import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Session,
  UseInterceptors, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guard';
import { customInterceptorSerialize } from '../interceptors';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators';
import { CreateUserDto, UserDto } from './dtos';
import { CurrentUserInterceptor } from './interceptors';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@customInterceptorSerialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
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
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
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
