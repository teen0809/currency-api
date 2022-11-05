import { IsNotEmpty, Min } from "class-validator";

export class CreateCurrencyTransaction {
    @IsNotEmpty()
    currency_id: number;

    @IsNotEmpty()
    currency_amount: number;

    user_id: number;

    create_date: Date;
}