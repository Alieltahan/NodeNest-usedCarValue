import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
import { scryptSync } from 'node:crypto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;

  beforeEach(() => {
    usersService = {
      find: jest.fn(),
      createUser: jest.fn(),
    };
    authService = new AuthService(usersService as UsersService);
  });

  it('should signup a new user', async () => {
    (usersService.find as jest.Mock).mockResolvedValue([]);
    (usersService.createUser as jest.Mock).mockResolvedValue({ id: 1, email: 'test@test.com', password: 'hashed' });

    const user = await authService.signup('test@test.com', 'password');
    expect(user).toHaveProperty('email', 'test@test.com');
    expect(usersService.createUser).toHaveBeenCalled();
  });

  it('should throw if email is in use', async () => {
    (usersService.find as jest.Mock).mockResolvedValue([{ id: 1, email: 'test@test.com', password: 'hashed' }]);
    await expect(authService.signup('test@test.com', 'password')).rejects.toThrow(BadRequestException);
  });

  it('should sign in with correct password', async () => {
    const password = 'password';
    const salt = '12345678abcdef';
    const hash = scryptSync(password, salt, 32).toString('hex');
    (usersService.find as jest.Mock).mockResolvedValue([{ id: 1, email: 'test@test.com', password: `${salt}.${hash}` }]);

    const user = await authService.signIn('test@test.com', password);
    expect(user).toHaveProperty('email', 'test@test.com');
  });

  it('should throw if password is incorrect', async () => {
    const salt = '12345678abcdef';
    const hash = scryptSync('password', salt, 32).toString('hex');
    (usersService.find as jest.Mock).mockResolvedValue([{ id: 1, email: 'test@test.com', password: `${salt}.${hash}` }]);

    await expect(authService.signIn('test@test.com', 'wrongpassword')).rejects.toThrow(BadRequestException);
  });

  it('should throw if user not found', async () => {
    (usersService.find as jest.Mock).mockResolvedValue([]);
    await expect(authService.signIn('notfound@test.com', 'password')).rejects.toThrow(BadRequestException);
  });
});
