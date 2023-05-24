import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdAccountsService } from './ad_accounts.service';
import { AdAccountDto } from './dto/create-adaccounts.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('ad-accounts')
export class AdAccountsController {
  constructor(private readonly adAccountsService: AdAccountsService) {}

  @Post()
  async create(@Body() adAccountData: AdAccountDto) {
    return this.adAccountsService.create(adAccountData);
  }

  @Get()
  async findAllAdAccounts() {
    return this.adAccountsService.findAllAdAccounts();
  }

  @Get(':accountId')
  async findAdAccount(@Param('accountId') accountId: string) {
    return this.adAccountsService.findAdAccount(accountId);
  }

  @Delete(':accountId')
  async deleteAdAccount(@Param('accountId') accountId: string) {
    return this.adAccountsService.deleteAdAccount(accountId);
  }

  @Put(':accountId')
  async updateAdAccount(
    @Body() adAccountData: AdAccountDto,
    @Param('accountId') accountId: string,
  ) {
    return this.adAccountsService.updateAdAccount(accountId, adAccountData);
  }
}
