import { Controller, Get, Param, Query } from '@nestjs/common';

import { DMReportingService } from './dm_reporting.service';
import { DMReportingEntity } from './dm_reporting.entity';
//@UseGuards(CustomCookieGuard)
@Controller('campaigns')
export class DMReportingController {
  constructor(private readonly extAPIService: DMReportingService) {}

  // Controller methods here
  @Get()
  async fetchExternalApiData(@Query('page') page: number, @Query('pageSize') pageSize: number): Promise<PaginationResponse<DMReportingEntity>> {

    const resp = await this.extAPIService.findAll(page, pageSize);
    return resp
  }
}
