import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Score } from './score';

@Entity()
export class ScoreRelation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Score, score => score.relations)
  score!: Score;

  @Column({ nullable: true })
  parent_score_id?: number;
}
