import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance, Currency, CurrencyConvertTransactions } from 'src/typeorm';
import { CurrencyTransaction } from 'src/typeorm';
import { CreateCurrencyTransaction } from './dtos/CurrencyTransaction.dto';
import { CreateBalance } from './dtos/CreateBalance.dto';
import { CreateCurrencyConvertTransaction } from './dtos/CurrencyConvertTransaction.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CurrencyService {
    constructor(
        @InjectRepository(CurrencyTransaction) private readonly currencyTransactionRepository: Repository<CurrencyTransaction>,
        @InjectRepository(Balance) private readonly balanceRepository: Repository<Balance>,
        @InjectRepository(CurrencyConvertTransactions) private readonly currencyConvertTransactionsRepository: Repository<CurrencyConvertTransactions>,
        @InjectRepository(Currency) private readonly currencyRepository: Repository<Currency>,
        private readonly configService: ConfigService,
    ) {}

    async createCurrencyTransaction(createCurrencyTransaction: CreateCurrencyTransaction) {
        const newCurrenyTransaction = this.currencyTransactionRepository.create(createCurrencyTransaction);
        return await this.currencyTransactionRepository.save(newCurrenyTransaction);
    }

    async createCurrencyConvertTransaction(createCurrencyConvertTransaction: CreateCurrencyConvertTransaction) {
        const newCurrenyConvertTransactions = this.currencyConvertTransactionsRepository.create(createCurrencyConvertTransaction);        
        return await this.currencyConvertTransactionsRepository.save(newCurrenyConvertTransactions);
    }

    async getTargetCurrencyAmount(createCurrencyConvertTransaction: CreateCurrencyConvertTransaction) {
        const mainCurrency = await this.currencyRepository.findOne({where: {id: createCurrencyConvertTransaction.main_currency_id}});
        const targetCurrency = await this.currencyRepository.findOne({where: {id: createCurrencyConvertTransaction.target_currency_id}});

        const myHeaders = new Headers();
        myHeaders.append("apikey", this.configService.get("CURRENCY_TOKEN"));

        const requestOptions: RequestInit = {
                method: 'GET',
                redirect: 'follow',
                headers: myHeaders
        };
        const res = await (await fetch(`https://api.apilayer.com/currency_data/convert?to=${targetCurrency.name}&from=${mainCurrency.name}&amount=${createCurrencyConvertTransaction.main_currency_amount}`, requestOptions)).json();        
        return res.result;
    }

    async depositCurrency(createCurrencyTransaction: CreateCurrencyTransaction) {
        // check that balance is already exist
        const balance = await this.balanceRepository.findOne({
            where: {
                currency_id: createCurrencyTransaction.currency_id,
                user_id: createCurrencyTransaction.user_id
            }
        })
        if(balance === null) {
            await this.createCurrencyTransaction(createCurrencyTransaction);

            const createBalance: CreateBalance = {
                user_id: createCurrencyTransaction.user_id,
                currency_id: createCurrencyTransaction.currency_id,
                currency_amount: createCurrencyTransaction.currency_amount
            }
            const newBalance = this.balanceRepository.create(createBalance);
            return await this.balanceRepository.save(newBalance);
        }
        else {
            // check the balance of currency can be less that zero
            balance.currency_amount = balance.currency_amount + createCurrencyTransaction.currency_amount;
            if(balance.currency_amount < 0)
                return "You can not withraw"
            await this.balanceRepository.update(balance.id, balance);
            return await this.balanceRepository.findOne({where:{id: balance.id}});
        }
    }

    async convertCurrency(createCurrencyConvertTransaction: CreateCurrencyConvertTransaction) {
        const mainCurrencyBalance = await this.balanceRepository.findOne({
            where: {
                currency_id: createCurrencyConvertTransaction.main_currency_id,
                user_id: createCurrencyConvertTransaction.user_id
            }
        })

        // check if main currency value can be less that 0
        if((mainCurrencyBalance === null) || (mainCurrencyBalance.currency_amount - createCurrencyConvertTransaction.main_currency_amount < 0)) {
            return "You can not change";
        }
        else {
            // get target currency balance using api
            createCurrencyConvertTransaction.target_currency_amount = await this.getTargetCurrencyAmount(createCurrencyConvertTransaction);
            // create record in currency convert transaction
            await this.createCurrencyConvertTransaction(createCurrencyConvertTransaction);
            // update main currency balance
            mainCurrencyBalance.currency_amount = mainCurrencyBalance.currency_amount - createCurrencyConvertTransaction.main_currency_amount;
            await this.balanceRepository.update(mainCurrencyBalance.id, mainCurrencyBalance);

            const targetCurrencyBalance = await this.balanceRepository.findOne({
                where: {
                    currency_id: createCurrencyConvertTransaction.target_currency_id,
                    user_id: createCurrencyConvertTransaction.user_id
                }
            })
            // update garget currency balance
            if(targetCurrencyBalance === null) {
                const createBalance: CreateBalance = {
                    user_id: createCurrencyConvertTransaction.user_id,
                    currency_id: createCurrencyConvertTransaction.target_currency_id,
                    currency_amount: createCurrencyConvertTransaction.main_currency_amount
                }
                const newBalance = this.balanceRepository.create(createBalance);
                return await this.balanceRepository.save(newBalance)
            }
            else {
                targetCurrencyBalance.currency_amount = targetCurrencyBalance.currency_amount + createCurrencyConvertTransaction.target_currency_amount;
                await this.balanceRepository.update(targetCurrencyBalance.id, targetCurrencyBalance);
            }

            return {
                balance: await Promise.all([this.balanceRepository.findOne({where:{id: mainCurrencyBalance.id}}), this.balanceRepository.findOne({where:{id: targetCurrencyBalance.id}})]),
                transaction: createCurrencyConvertTransaction,
            }
        }
    }
}
