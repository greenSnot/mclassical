import { Index, ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Score } from './score';

@Entity()
export class ScorePDFPart {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Score, score => score.pdf_parts)
  score!: Score;

  @Column()
  name!: string;

  @Column()
  pdf_url!: string;
}
