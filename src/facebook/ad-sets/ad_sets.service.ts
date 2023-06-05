import { Inject, Injectable, Logger } from '@nestjs/common';
import { AdAccountsService } from 'src/ad_accounts/ad_accounts.service';
import { FACEBOOK_ACCESS_TOKEN, FACEBOOK_API_URL } from 'src/config';
import axios, { AxiosResponse } from 'axios';
import { PaginationService } from 'src/pagination/pagination.service';
import { AdSets } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdSetsService {
  constructor(
    @Inject(AdAccountsService)
    private readonly adAccountService: AdAccountsService,

    private readonly logger: Logger,
    private readonly paginationService: PaginationService<AdSets>,
    private prisma: PrismaService,
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
          this.logger.log('Started cron job for Facebook AdSets API');
          const response: AxiosResponse = await axios.get(url);
          if (response) {
            response.data.data.forEach((record) => {
              const adSetData = this.prisma.adSets.create({
                data: {
                  facebook_id: record.id,
                  status: record.status,
                  name: record.name,
                  daily_budget: record.daily_budget,
                  created_time: record.created_time,
                  start_time: record.start_time,
                  adaccount_id: accountId,
                },
              });
            });
            //await this.em.flush();

            this.logger.log(
              `Fetched ${response.data.data.length} facebook entries succesfully`,
            );
            this.logger.log('Completed cron job for Facebook AdSets API');
          }
        } catch (error) {
          this.logger.debug(error);
          this.logger.error('Failed to fetch data from Facebook API');
        }
      });
    }
  }
  async getAdSetsData(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginationResponse<AdSets>> {
    const skip = (page - 1) * pageSize;
    const take: number = +pageSize;

    const adSets = await this.prisma.adSets.findMany({
      skip,
      take,
    });
    const totalItems = await this.prisma.adSets.count(); // Count total number of items
    return this.paginationService.getPaginationData(
      page,
      pageSize,
      adSets,
      totalItems,
    );
  }
}
