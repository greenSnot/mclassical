import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ScoreName {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  score_id!: string;

  @Column()
  name!: string;

  @Column()
  lang!: string;

  @Column()
  is_local_name!: boolean;
}
