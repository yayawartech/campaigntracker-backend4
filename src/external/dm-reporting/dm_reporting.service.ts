import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { DMReportingEntity } from './dm_reporting.entity';
import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { EXTERNAL_ACCESS_KEY, EXTERNAL_ACCESS_TOKEN, EXTERNAL_API_URL } from 'src/config';
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
    
    const url = EXTERNAL_API_URL + '&key='+EXTERNAL_ACCESS_KEY+'&token='+EXTERNAL_ACCESS_TOKEN+'&startDate='+startDate+'&endDate='+endDate;    
    
    try {
      const response: AxiosResponse = await axios.get(url);
      response.data.map(async (record) => {
        
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
          record.TQ
        );
        await this.em.persistAndFlush(campaign_data);
      });
      this.logger.warn(`Fetched ${response.data.length} entries succesfully`);
      const data = response.data;
      return data;
    } catch (error) {
      // Handle error if the API request fails
      throw new Error('Failed to fetch data from API');
    }
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<PaginationResponse<DMReportingEntity>> {
    const query = this.externalAPIRepostitory.createQueryBuilder();

    query.offset((page - 1) * pageSize).limit(pageSize);

    const [items, totalItems] = await query.getResultAndCount();
    
    return this.paginationService.getPaginationData(page,pageSize,items,totalItems);
    
  }
}
