import { Controller, Get, Query } from '@nestjs/common';
import { AdSetsService } from './ad_sets.service';
import { AdSetsEntity } from './ad_sets.entity';

@Controller('ad_sets')
export class AdSetsController {
  constructor(private readonly adSetsService: AdSetsService) {}
  @Get()
  async getAdSetsData(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<PaginationResponse<AdSetsEntity>> {
    const resp = await this.adSetsService.getAdSetsData(page, pageSize);
    return resp;
  }
}
