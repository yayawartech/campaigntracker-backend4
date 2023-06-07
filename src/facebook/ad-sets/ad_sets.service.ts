import { Inject, Injectable, Logger } from '@nestjs/common';
import { AdAccountsService } from 'src/ad_accounts/ad_accounts.service';
import { FACEBOOK_ACCESS_TOKEN, FACEBOOK_API_URL } from 'src/config';
import axios, { AxiosResponse } from 'axios';
import { PaginationService } from 'src/pagination/pagination.service';
import { AdSets, AdSetsHistory } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdSetsService {
  constructor(
    @Inject(AdAccountsService)
    private readonly adAccountService: AdAccountsService,

    private readonly logger: Logger,
    private readonly paginationService: PaginationService<AdSetsHistory>,
    private prisma: PrismaService,
  ) {}
  //Adsets History
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
          this.logger.log('Started cron job for Facebook AdSetsHistory API');
          const response: AxiosResponse = await axios.get(url);
          if (response) {
            const promises: AdSetsHistory[] = response.data.data.map(
              async (record) => {
                const adSetDataHistory = await this.prisma.adSetsHistory.create(
                  {
                    data: {
                      facebook_id: record.id,
                      status: record.status,
                      name: record.name,
                      daily_budget: record.daily_budget,
                      created_time: record.created_time,
                      start_time: record.start_time,
                      adaccount_id: accountId,
                    },
                  },
                );
                return adSetDataHistory;
              },
            );
            const createdAdSets = await Promise.all(promises);

            this.logger.log(
              `Fetched ${response.data.data.length} facebook entries succesfully`,
            );
            this.logger.log(
              'Completed cron job for Facebook AdSetsHistory API',
            );
          }
        } catch (error) {
          this.logger.debug(error);
          this.logger.error('Failed to fetch data from Facebook API(History)');
        }
      });
    }
  }

  //Adsets latest Data

  async AdSetsCronJob(): Promise<void> {
    try {
      this.logger.log('Started cron job for Facebook Latest AdSets Data');
      const data = await this.prisma.adSetsHistory.findMany({
        take: 10,
      });
      const InsertedData: AdSets[] = await Promise.all(
        data.map(async (record) => {
          try {
            const InsertData = await this.prisma.adSets.create({
              data: {
                facebook_id: record.facebook_id,
                status: record.status,
                name: record.name,
                daily_budget: record.daily_budget,
                created_time: record.created_time,
                start_time: record.start_time,
                adaccount_id: record.adaccount_id,
              },
            });
            return InsertData;
          } catch (error) {
            this.logger.error('Error inserting Latest AdSets record:', error);
            return null;
          }
        }),
      );
      this.logger.log('Latest AdSets Data Inserted');
    } catch (error) {
      this.logger.error('Error fetching Latest AdSets data:', error);
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
