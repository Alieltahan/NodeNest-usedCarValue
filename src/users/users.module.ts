import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  // If we want to make our interceptor Global for the Entire App.
  // providers: [UsersService, AuthService,
  //     {
  //     provide: APP_INTERCEPTOR,
  //     useClass: CurrentUserInterceptor
  //     }
  //   ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      CurrentUserMiddleware
    ).forRoutes('*')
  }
}
