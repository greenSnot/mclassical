import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ScoreInstrument {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  score_id!: number;

  @Column()
  instrument_name!: string;
}
