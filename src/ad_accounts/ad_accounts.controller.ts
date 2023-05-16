import { Body, Controller, Post } from '@nestjs/common';
import { AdAccountsService } from './ad_accounts.service';
import { CreateAdAccountDto } from './dto/create-adaccounts.dto';

@Controller('adaccounts')
export class AdAccountsController {
    constructor( 
        private readonly adAccountsService: AdAccountsService
    ){}
    
    @Post('create')
    async create(@Body() adAccountData: CreateAdAccountDto){
        return this.adAccountsService.create(adAccountData);
    }
}
