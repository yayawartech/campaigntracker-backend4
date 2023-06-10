import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';

import { DMReportingService } from './dm_reporting.service';
import { DmReporting } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
//@UseGuards(CustomCookieGuard)
@Controller('campaigns')
@UseGuards(AuthGuard('jwt'))
export class DMReportingController {
  constructor(private readonly dmReportingService: DMReportingService) {}

  @Get()
  async fetchExternalApiData(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ): Promise<PaginationResponse<DmReporting>> {
    const resp = await this.dmReportingService.findAll(
      page,
      pageSize,
      fromDate,
      toDate,
    );
    return resp;
  }
}
