import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CurrencyTransaction {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    nullable: false,
    type: 'bigint'
  })
  currency_id: number;

  @Column({
    nullable: false,
    type: 'float'
  })
  currency_amount: number;

  @Column({
    nullable: false,
    type: 'bigint'
  })
  user_id: number;

  @Column({
    nullable: false,
    type: 'timestamptz'
  })
  create_date: Date;

}