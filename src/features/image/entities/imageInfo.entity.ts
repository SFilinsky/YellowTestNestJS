import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ImageInfo {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  originalName!: string;

  @Column()
  destination!: string;

  @Column()
  fileName!: string;

  @Column()
  path!: string;

  @Column()
  size!: number;
}
