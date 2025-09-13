import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, CurrentUserInterceptor],
  // If we want to make our interceptor Global for the Entire App.
  // providers: [UsersService, AuthService,
  //     {
  //     provide: APP_INTERCEPTOR ,
  //     useClass: CurrentUserInterceptor
  //     }
  //   ],
})
export class UsersModule {}
