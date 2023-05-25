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
    const adAccountData = await this.adAccountService.findAllAdAccounts();
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
          const { data }: AxiosResponse = await axios.get(url);
          data.data.map(async (d: AdSetsEntity) => {
            const faceBookData = new AdSetsEntity(
              d.id,
              d.status,
              d.name,
              d.daily_budget,
              d.created_time,
              d.start_time,
              accountId,
            );
            await this.em.persistAndFlush(faceBookData);
          });
          this.logger.warn(
            `Fetched ${data.data.length} facebook entries succesfully`,
          );
        } catch (error) {
          throw new Error('Failed to fetch data from API');
        }
      });
    }
    return [1, 2, 3];
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
