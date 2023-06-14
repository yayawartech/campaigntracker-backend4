import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';

import { DMReportingService } from './dm_reporting.service';
import { DmReporting, v_spendreport } from '@prisma/client';
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

  @Get('/spend-report')
  async fetchReport(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('sort')
    sort:
      | {
          id: 'string';
          desc: string;
        }
      | undefined,
  ): Promise<PaginationResponse<v_spendreport>> {
    const resp = await this.dmReportingService.fetchSpendReport(
      page,
      pageSize,
      fromDate,
      toDate,
      sort,
    );
    return resp;
  }
}
