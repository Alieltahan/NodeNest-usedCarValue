import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { UsersService } from './users.service';

const asyncScrypt = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    const user = await this.usersService.find(email);
    if (user.length) {
      throw new BadRequestException('email in use');
    }
    const salt = randomBytes(8).toString('hex');

    const hash = (await asyncScrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    return this.usersService.createUser(email, result);
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await asyncScrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Email or password is incorrect');
    }

    return user;
  }
}
