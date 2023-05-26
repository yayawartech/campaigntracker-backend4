import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AdSetsEntity } from './ad_sets.entity';
import { AdAccountsService } from 'src/ad_accounts/ad_accounts.service';
import { FACEBOOK_ACCESS_TOKEN, FACEBOOK_API_URL } from 'src/config';
import axios, { AxiosResponse } from 'axios';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class AdSetsService {
  constructor(
    @InjectRepository(AdSetsEntity)
    private readonly adSetsRepostitory: EntityRepository<AdSetsEntity>,
    private readonly em: EntityManager,
    
    @Inject(AdAccountsService)
    private readonly adAccountService: AdAccountsService,
    
    private readonly logger: Logger,
    private readonly paginationService: PaginationService<AdSetsEntity>,
  ) {}
  async fetchAdSetsDataFromApi(): Promise<any> {
    const adAccountData = await this.adAccountService.findAllAccounts();
    let accountId = null;

    if (adAccountData) {
      adAccountData.map(async (adAccount) => {
        const accountId = adAccount.accountId;
        const url =
          FACEBOOK_API_URL +
          'act_' +
          accountId +
          '/adsets?fields=status,name,daily_budget,created_time,start_time&access_token=' +
          FACEBOOK_ACCESS_TOKEN;
        try {
          this.logger.log("Started cron job for Facebook AdSets API");
          const response: AxiosResponse = await axios.get(url);
          if (response){            
            response.data.data.forEach(record => {
              const faceBookData = new AdSetsEntity(
                record.id,
                record.status,
                record.name,
                record.daily_budget,
                record.created_time,
                record.start_time,
                accountId,
              );
              this.em.persist(faceBookData);
            });
            await this.em.flush()
  
            this.logger.log(
              `Fetched ${response.data.data.length} facebook entries succesfully`,
            );
            this.logger.log("Completed cron job for Facebook AdSets API");
          }
          
        } catch (error) {
          this.logger.debug(error)
          this.logger.error('Failed to fetch data from Facebook API');
        }
      });
    }
  }
  async getAdSetsData(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginationResponse<AdSetsEntity>> {
    const query = this.adSetsRepostitory.createQueryBuilder();
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
