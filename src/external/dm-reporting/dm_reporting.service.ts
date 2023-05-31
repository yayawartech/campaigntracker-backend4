import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { DMReportingEntity } from './dm_reporting.entity';
import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import {
  DM_REPORTING_ACCESS_KEY,
  DM_REPORTING_ACCESS_TOKEN,
  DM_REPORTING_URL,
} from 'src/config';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class DMReportingService {
  constructor(
    @InjectRepository(DMReportingEntity)
    private readonly externalAPIRepostitory: EntityRepository<DMReportingEntity>,
    private readonly em: EntityManager,
    private readonly paginationService: PaginationService<DMReportingEntity>,
    private readonly logger: Logger,
  ) {}

  // Service Commands files
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

      response.data.forEach((record) => {
        const campaign_data = new DMReportingEntity(
          record.Advertiser,
          record.Domain,
          record.Manager,
          record.Buyer,
          record.Date,
          record.Hour,
          record.Campaign,
          record.Adset,
          record.Adsetid,
          record.Revenue,
          record.Spend,
          record.Link_Clicks,
          record.Ad_Clicks,
          record.GP,
          record.Searches,
          record.Clicks,
          record.TQ,
        );
        this.em.persist(campaign_data);
      });
      await this.em.flush();
      this.logger.log('Completed cron job for DM Reporting API');
      this.logger.log(`Fetched ${response.data.length} entries succesfully`);
      const data = response.data;
      return data;
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
  ): Promise<PaginationResponse<DMReportingEntity>> {
    const query = this.externalAPIRepostitory.createQueryBuilder();

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

      query.where({ date: { $gte: fromQueryDate } });
      query.andWhere({ date: { $lte: formattedToDate } });
    }

    query.offset((page - 1) * pageSize).limit(pageSize);
    const [items, totalItems] = await query.getResultAndCount();

    return this.paginationService.getPaginationData(
      page,
      pageSize,
      items,
      totalItems,
    );
  }
}
