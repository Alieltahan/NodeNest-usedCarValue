// src/users/auth.service.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from "../src/users/auth.service";
import { User } from "../src/users/user.entity";
import { UsersService } from "../src/users/users.service";

describe('AuthService E2E', () => {
	let authService: AuthService;
	let usersService: UsersService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forRoot({
					type: 'sqlite',
					database: 'test.db.sqlite',
					entities: [User],
					synchronize: true,
				}),
				TypeOrmModule.forFeature([User]),
			],
			providers: [AuthService, UsersService],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		usersService = module.get<UsersService>(UsersService);
	});

	it('should signup and sign in a user', async () => {
		const user = await authService.signup('e2e@test.com', 'password');
		expect(user).toHaveProperty('email', 'e2e@test.com');

		const signedIn = await authService.signIn('e2e@test.com', 'password');
		expect(signedIn).toHaveProperty('email', 'e2e@test.com');
	});

	it('should not sign up with duplicate email', async () => {
		await authService.signup('dup@test.com', 'password');
		await expect(authService.signup('dup@test.com', 'password')).rejects.toThrow();
	});

	it('should not sign in with wrong password', async () => {
		await authService.signup('wrongpass@test.com', 'password');
		await expect(authService.signIn('wrongpass@test.com', 'bad')).rejects.toThrow();
	});
});
