import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

interface customRequest extends Request {
  currentUser?: User,
  session: {
    userId: string;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: customRequest, _res: Response, next: NextFunction) {
    const { userId } = req?.session || {}

    if (userId) {
      const user = await this.usersService.findOne(parseInt(userId));
      if (user) {
        req.currentUser = user;
      }
    }

    next();
  }
}
