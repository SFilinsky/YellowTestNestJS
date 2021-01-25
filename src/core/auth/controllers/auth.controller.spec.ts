import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { Test } from '@nestjs/testing';
import { InsertResult } from 'typeorm';
import { UsernameNotFoundException } from '../../exceptions/exceptions/username-not-found.exception';
import { WrongPasswordException } from '../../exceptions/exceptions/wrong-password.exception';
import { UsernameTakenException } from '../../exceptions/exceptions/username-taken.exception';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: () => 'mock',
            register: () => 'mock',
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return JWT Token', async () => {
      const result = 'test';
      jest
        .spyOn(authService, 'login')
        .mockImplementation((_) => Promise.resolve(result));

      expect(await authController.login({})).toBe(result);
    });

    it('should give user not found error', async () => {
      const usernameNotFoundException = new UsernameNotFoundException();
      jest.spyOn(authService, 'login').mockImplementation((_) => {
        throw usernameNotFoundException;
      });

      await authController.login({}).catch((e) => {
        expect(e).toBe(usernameNotFoundException);
      });
    });

    it('should give wrong password error', async () => {
      const wrongPasswordException = new WrongPasswordException();
      jest.spyOn(authService, 'login').mockImplementation((_) => {
        throw wrongPasswordException;
      });

      await authController.login({}).catch((e) => {
        expect(e).toBe(wrongPasswordException);
      });
    });
  });

  describe('register', () => {
    it('should return', async () => {
      const registerDto = { username: 'test', password: 'test' };
      jest
        .spyOn(authService, 'register')
        .mockImplementation((_) => Promise.resolve(new InsertResult()));

      expect(await authController.register(registerDto));
    });

    it('should give username taken error', async () => {
      const usernameTakenException = new UsernameTakenException();
      jest.spyOn(authService, 'register').mockImplementation((_) => {
        throw usernameTakenException;
      });

      await authController.login({}).catch((e) => {
        expect(e).toBe(usernameTakenException);
      });
    });
  });
});
