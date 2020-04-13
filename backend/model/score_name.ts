import { Index, ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Score } from './score';

@Entity()
export class ScoreName {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Score, score => score.names)
  score!: Score;

  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 1024 })
  name!: string;

  @Index()
  @Column()
  lang!: string;

  @Column()
  is_local_name!: boolean;
}
