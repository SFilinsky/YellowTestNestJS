import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { hash } from 'bcrypt';
import { AuthConstants } from '../constants/auth.constants';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, AuthConstants.passwordSaltRounds);
  }
}

export interface SafeUser {
  id: number;
  username: string;
}
