import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  mnx_complete!: string;

  @Column()
  pdf_complete!: string;

  @Column()
  pdf_parts!: string;
}
