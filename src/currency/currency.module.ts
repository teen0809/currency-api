import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyConvertTransactions, CurrencyTransaction, Currency, Balance } from 'src/typeorm';
import { CurrencyService } from './currency.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([CurrencyConvertTransactions]),
    TypeOrmModule.forFeature([Currency]),
    TypeOrmModule.forFeature([CurrencyTransaction]),
    TypeOrmModule.forFeature([Balance]),
    ConfigModule
  ],
  providers: [
    CurrencyService, 
    ConfigService
  ],
  exports: [CurrencyService]
})
export class CurrencyModule {}
