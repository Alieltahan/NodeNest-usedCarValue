import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { UsersService } from './users.service';

const asyncScrypt = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    // see if email is in use
    const user = await this.usersService.find(email);
    // if it is throw an error
    if (user.length) {
      throw new BadRequestException('email in use');
    }
    // Hash the users password
    // How should I hash the password via nestjs?
    // Generate a Salt using randomBytes...
    const salt = randomBytes(8).toString('hex');

    // const salt = await bcrypt.genSalt();
    // Hash the salt and the password together
    const hash = (await asyncScrypt(password, salt, 32)) as Buffer;
    // Store the salt and the hash in the password column

    const result = salt + '.' + hash.toString('hex');

    return this.usersService.createUser(email, result);
    // create a new user and save it
    // return the user
  }

  signIn() {}
}
