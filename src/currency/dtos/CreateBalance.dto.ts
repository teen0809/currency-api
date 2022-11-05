import { IsNotEmpty, Min } from "class-validator";

export class CreateBalance {
    @IsNotEmpty()
    currency_id: number;

    @IsNotEmpty()
    currency_amount: number;

    user_id: number;
}