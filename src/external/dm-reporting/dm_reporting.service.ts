import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { DmReportingHistory } from '@prisma/client';
import {
  DM_REPORTING_ACCESS_KEY,
  DM_REPORTING_ACCESS_TOKEN,
  DM_REPORTING_URL,
} from 'src/config';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DMReportingService {
  constructor(
    private prismaService: PrismaService,
    private readonly paginationService: PaginationService<DmReportingHistory>,
    private readonly logger: Logger,
  ) {}

  async fetchExternalApiData(startDate: string, endDate: string): Promise<any> {
    const url =
      DM_REPORTING_URL +
      '&key=' +
      DM_REPORTING_ACCESS_KEY +
      '&token=' +
      DM_REPORTING_ACCESS_TOKEN +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate;

    try {
      this.logger.log('Started cron job for DM Reporting API');
      const response: AxiosResponse = await axios.get(url);
      if (response) {
        const dataToInsert: DmReportingHistory[] = response.data.map(
          (record) => {
            const createdRecords = this.prismaService.dmReportingHistory.create(
              {
                data: {
                  advertiser: record.Advertiser,
                  domain: record.Domain,
                  manager: record.Manager,
                  buyer: record.Buyer,
                  date: record.Date,
                  hour: record.Hour,
                  campaign: record.Campaign,
                  adset: record.Adset,
                  adsetid: record.Adsetid,
                  revenue: record.Revenue,
                  spend: record.Spend,
                  link_clicks: record.Link_Clicks,
                  ad_clicks: record.Ad_Clicks,
                  gp: record.GP,
                  searches: record.Searches,
                  clicks: record.Clicks,
                  tq: record.TQ,
                },
              },
            );
          },
        );
      }

      this.logger.log('Completed cron job for DM Reporting API');
      this.logger.log(`Fetched ${response.data.length} entries successfully`);
      return response.data;
    } catch (error) {
      this.logger.debug(error);
      this.logger.error('Failed to fetch data from DM Reporting API');
    }
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    fromDate: string = null,
    toDate: string = null,
  ): Promise<PaginationResponse<DmReportingHistory>> {
    const skip = (page - 1) * pageSize;
    const take: number = +pageSize;
    let where: any = {};

    // From and To query manipulation
    if (fromDate !== null && toDate !== null) {
      const fromQueryDate = new Date(fromDate)
        .toISOString()
        .replace('T', ' ')
        .replace('.000Z', '');

      const toQueryDate = new Date(toDate);
      toQueryDate.setUTCHours(23, 59, 59);

      const formattedToDate = toQueryDate
        .toISOString()
        .replace('T', ' ')
        .replace('.000Z', '');

      where = {
        ...where,
        date: {
          gte: fromQueryDate,
          lte: formattedToDate,
        },
      };
    }

    const items = await this.prismaService.dmReportingHistory.findMany({
      skip,
      take,
      where,
    });
    const totalItems = await this.prismaService.dmReportingHistory.count();

    return this.paginationService.getPaginationData(
      page,
      pageSize,
      items,
      totalItems,
    );
  }
}
