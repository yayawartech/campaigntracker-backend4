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
