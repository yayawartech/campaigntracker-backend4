import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { DmReporting, DmReportingHistory } from '@prisma/client';
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
      this.logger.log('Started cron job for History DM Reporting API');
      const response: AxiosResponse = await axios.get(url);
      if (response) {
        const dataToInsert: DmReportingHistory[] = response.data.map(
          (record) => {
            const manager = record.Manager || null;
            const createdRecords = this.prismaService.dmReportingHistory.create(
              {
                data: {
                  advertiser: record.Advertiser,
                  domain: record.Domain,
                  manager: manager,
                  buyer: record.Buyer,
                  date: record.Date,
                  hour: record.Hour,
                  campaign: record.Campaign,
                  adset: record.Adset,
                  adsetid: record.AdsetId,
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
            return createdRecords;
          },
        );
        const createdDmReporting = await Promise.all(dataToInsert);
      }

      this.logger.log('Completed cron job for History DM Reporting API');
      this.logger.log(`Fetched ${response.data.length} entries successfully`);
      return response.data;
    } catch (error) {
      this.logger.debug(error);
      this.logger.error('Failed to fetch data from DM Reporting(History) API');
    }
  }

  async DmReportingCronJob(): Promise<void> {
    this.logger.log('Started cron job for Latest DM Reporting');
    try {
      const data = await this.prismaService.dmReportingHistory.findMany({
        take: 10,
      });
      const insertData = await Promise.all(
        data.map(async (record) => {
          try {
            const latestData = await this.prismaService.dmReporting.create({
              data: {
                advertiser: record.advertiser,
                domain: record.domain,
                manager: record.manager,
                buyer: record.buyer,
                date: record.date,
                hour: record.hour,
                campaign: record.campaign,
                adset: record.adset,
                adsetid: record.adsetid,
                revenue: record.revenue,
                spend: record.spend,
                link_clicks: record.link_clicks,
                ad_clicks: record.ad_clicks,
                gp: record.gp,
                searches: record.searches,
                clicks: record.clicks,
                tq: record.tq,
              },
            });
            return latestData;
          } catch (error) {
            this.logger.error(
              'Error inserting Latest DM Reporting record:',
              error,
            );
            return null;
          }
        }),
      );
      this.logger.log('Latest DmReporting Data Inserted');
    } catch (error) {
      this.logger.error('Error fetching data Latest DM Reporting:', error);
    }
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    fromDate: string = null,
    toDate: string = null,
  ): Promise<PaginationResponse<DmReporting>> {
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

    const items = await this.prismaService.dmReporting.findMany({
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
