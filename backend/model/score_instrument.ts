import { Index, ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Score } from './score';

@Entity()
export class ScoreInstrument {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Score, score => score.instruments)
  score!: Score;

  @Index()
  @Column()
  instrument_name!: string;
}
