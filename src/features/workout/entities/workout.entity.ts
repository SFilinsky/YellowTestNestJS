import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../core/auth/entities/user.entity';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsOptional } from 'class-validator';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Workout {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ comment: 'Distance of a run in meters' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  distance!: number;

  @Column({ comment: 'Time of a run in seconds' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  time!: number;

  @Column({ comment: 'Date of a run start' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  date!: Date;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (t) => t.id)
  user!: User;
}
