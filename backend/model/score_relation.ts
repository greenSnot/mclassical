import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ScoreRelation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  score_id!: number;

  @Column()
  parent_score_id!: number;
}
