import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty()
  @Column()
  identifier?: string;

  @ApiProperty()
  @Column()
  tag?: string;
}
