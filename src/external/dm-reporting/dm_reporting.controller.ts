import { Controller, Get, Param, Query } from '@nestjs/common';

import { DMReportingService } from './dm_reporting.service';
import { DmReporting, DmReportingHistory } from '@prisma/client';
//@UseGuards(CustomCookieGuard)
@Controller('campaigns')
export class DMReportingController {
  constructor(private readonly extAPIService: DMReportingService) {}

  // Controller methods here
  @Get()
  async fetchExternalApiData(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ): Promise<PaginationResponse<DmReporting>> {
    const resp = await this.extAPIService.findAll(
      page,
      pageSize,
      fromDate,
      toDate,
    );
    return resp;
  }
}
