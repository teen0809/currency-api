import { Balance } from "./balance.entity";
import { Currency } from "./currency.entity";
import { CurrencyConvertTransactions } from "./currencyConvertTransactions.entity";
import { CurrencyTransaction } from "./currencyTransaction.entity";
import { User } from "./user.entity";

const entities = [
    User, 
    CurrencyConvertTransactions, 
    Currency,
    CurrencyTransaction,
    Balance,
];

export {
    User, 
    CurrencyConvertTransactions, 
    Currency,
    CurrencyTransaction,
    Balance,
};
export default entities;