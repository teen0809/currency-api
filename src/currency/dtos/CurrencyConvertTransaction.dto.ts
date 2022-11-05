import { IsNotEmpty, Min } from "class-validator";

export class CreateCurrencyConvertTransaction {
    @IsNotEmpty()
    main_currency_id: number;

    @IsNotEmpty()
    main_currency_amount: number;

    @IsNotEmpty()
    target_currency_id: number;

    target_currency_amount: number;

    user_id: number;

    create_date: Date;
}