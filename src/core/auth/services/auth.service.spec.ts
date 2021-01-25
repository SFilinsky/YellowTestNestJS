import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SafeUser, User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  const loginUser: SafeUser = {
    id: 1,
    username: 'TestUser',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: () => '',
          },
        },
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return signed token', async () => {
      const result = 'signed';
      jest.spyOn(jwtService, 'sign').mockImplementation(() => result);

      expect(await service.login(loginUser)).toBe('signed');
    });
  });
});
