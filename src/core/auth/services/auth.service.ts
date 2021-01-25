import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SafeUser, User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { WrongPasswordException } from '../../exceptions/exceptions/wrong-password.exception';
import { UsernameNotFoundException } from '../../exceptions/exceptions/username-not-found.exception';
import { UsernameTakenException } from '../../exceptions/exceptions/username-taken.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

export interface JwtPayload {
  username: string;
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login(user: SafeUser) {
    return this.jwtService.sign(this.buildJwtPayload(user));
  }

  async register(username: string, password: string) {
    const user = Object.assign(new User(), {
      username,
      password,
    });
    if (await this.checkIfUserTaken(user)) {
      throw new UsernameTakenException();
    }
    return await this.addOne(user);
  }

  async checkIfUserTaken(user: User): Promise<boolean> {
    return this.findOneByUsername(user.username).then((user) => !!user);
  }

  buildJwtPayload(user: SafeUser) {
    return { username: user.username, userId: user.id };
  }

  parseJwtPayload(payload: JwtPayload): { user: SafeUser } {
    return { user: { username: payload.username, id: payload.userId } };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder()
      .select(Object.keys(new User()))
      .where('username = :username', { username: username })
      .execute()
      .then((users) => {
        return users;
      })
      .then((users) => users[0]);
  }

  async addOne(user: DeepPartial<User>) {
    return this.userRepository.insert(user).catch(() => {
      throw new InternalServerErrorException('Could not create new user in DB');
    });
  }

  async validateUser(username: string, pass: string): Promise<SafeUser | null> {
    const user = await this.findOneByUsername(username);
    // If wrong username
    if (!user) {
      throw new UsernameNotFoundException();
    }
    // If wrong password
    if (!(await compare(pass, user.password))) {
      throw new WrongPasswordException();
    }
    const { password, ...result } = user;
    return result;
  }
}
