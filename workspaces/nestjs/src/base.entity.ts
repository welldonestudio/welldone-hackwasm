import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export abstract class BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column() createdAt: Date;
  @Column() createdBy: string;
  @Column() updatedAt: Date;
  @Column() updatedBy: string;
}
