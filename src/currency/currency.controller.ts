import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrencyService } from './currency.service';
import { CreateBalance } from './dtos/CreateBalance.dto';
import { CreateCurrencyConvertTransaction } from './dtos/CurrencyConvertTransaction.dto';
import { CreateCurrencyTransaction } from './dtos/CurrencyTransaction.dto';

@Controller('currency')
export class CurrencyController {

    constructor(
        private readonly currencyService: CurrencyService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('deposit')
    async depositCurrency(@Request() req, @Body() createCurrencyTransaction: CreateCurrencyTransaction) {
        createCurrencyTransaction.user_id = req.user.userId;
        createCurrencyTransaction.create_date = new Date();
        return await this.currencyService.depositCurrency(createCurrencyTransaction);
    }

    @UseGuards(JwtAuthGuard)
    @Post('convert')
    async convertCurrency(@Request() req, @Body() createCurrencyConvertTransaction: CreateCurrencyConvertTransaction) {
        createCurrencyConvertTransaction.user_id = req.user.userId;
        createCurrencyConvertTransaction.create_date = new Date();
        return await this.currencyService.convertCurrency(createCurrencyConvertTransaction);
    }

    @UseGuards(JwtAuthGuard)
    @Get('balcance')
    async getBlance(@Request() req) {
    }

}
