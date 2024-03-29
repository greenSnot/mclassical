import { Index, Entity, Unique, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
@Index(['name', 'player', 'album_name'], { fulltext: true })
@Unique(['uid'])
export class AudioWithAlbum {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  uid!: string;

  @Column()
  reference_url!: string;

  @Column()
  player!: string;

  @Column()
  album_name!: string;

  @Column()
  name!: string;

  @Column()
  album_sd!: string;

  @Column()
  album_hd!: string;

  @Column({ comment: 'QQMusic/netease...' })
  source!: string;
}
