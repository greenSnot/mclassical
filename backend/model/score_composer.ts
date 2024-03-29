import { Index, ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Score } from './score';

@Entity()
export class ScoreComposer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Score, score => score.composers)
  score!: Score;

  @Index({ fulltext: true })
  @Column()
  name!: string;
}
