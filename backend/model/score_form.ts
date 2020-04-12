import { Index, ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Score } from './score';

@Entity()
export class ScoreForm {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Score, score => score.forms)
  score!: Score;

  @Index()
  @Column()
  name!: string;
}
