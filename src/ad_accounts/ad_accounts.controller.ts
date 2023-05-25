import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AdAccountsService } from './ad_accounts.service';
import { AdAccountDto } from './dto/create-adaccounts.dto';

@Controller('ad-accounts')
export class AdAccountsController {
  constructor(private readonly adAccountsService: AdAccountsService) {}

  @Post()
  async create(@Body() adAccountData: AdAccountDto) {
    return this.adAccountsService.create(adAccountData);
  }

  @Get()
  async getAllAdaccounts(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const resp = await this.adAccountsService.findAllAdAccounts(page, pageSize);
    return resp;
  }

  @Get(':id')
  async findAdAccount(@Param('id') id: string) {
    return this.adAccountsService.findAdAccount(id);
  }

  @Delete(':id')
  async deleteAdAccount(@Param('id') id: string) {
    return this.adAccountsService.deleteAdAccount(id);
  }

  @Put(':id')
  async updateAdAccount(
    @Body() adAccountData: AdAccountDto,
    @Param('id') id: string,
  ) {
    return this.adAccountsService.updateAdAccount(id, adAccountData);
  }
}
