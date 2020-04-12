import { OneToMany, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ScoreComposer } from './score_composer';
import { ScoreInstrument } from './score_instrument';
import { ScoreName } from './score_name';
import { ScoreRelation } from './score_relation';
import { ScoreForm } from './score_form';
import { ScorePDFPart } from './score_pdf_part';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  mnx_complete!: string;

  @Column()
  pdf_complete!: string;

  @OneToMany(
    type => ScorePDFPart,
    part => part.score
  )
  pdf_parts!: ScorePDFPart[];

  @OneToMany(
    type => ScoreForm,
    form => form.score
  )
  forms!: ScoreForm[];

  @OneToMany(
    type => ScoreInstrument,
    instrument => instrument.score
  )
  instruments!: ScoreInstrument[];

  @OneToMany(
    type => ScoreName,
    name => name.score
  )
  names!: ScoreName[];

  @OneToMany(
    type => ScoreComposer,
    composer => composer.score
  )
  composers!: ScoreComposer[];

  @OneToMany(
    type => ScoreRelation,
    relation => relation.score
  )
  relations!: ScoreRelation[];
}
