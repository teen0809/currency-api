import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CurrencyConvertTransactions {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    nullable: false,
    type: 'bigint'
  })
  main_currency_id: number;

  @Column({
    nullable: false,
    type: 'float'
  })
  main_currency_amount: number;

  @Column({
    nullable: false,
    type: 'bigint'
  })
  target_currency_id: number;

  @Column({
    nullable: false,
    type: 'float'
  })
  target_currency_amount: number;

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