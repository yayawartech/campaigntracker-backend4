import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DMReportingService } from './external/dm-reporting/dm_reporting.service';
import { AdSetsService } from './facebook/ad-sets/ad_sets.service';

@Injectable()
export class TrackerCronJob {
  constructor(
    private readonly extAPIService: DMReportingService,

    private readonly adSetsService: AdSetsService,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleCron(): Promise<any> {
    this.logger.log('Running cron job...');
    const startDate = '2023-05-21T00:00:00';
    const endDate = '2023-05-21T00:00:00';
    const data = await this.extAPIService.fetchExternalApiData(
      startDate,
      endDate,
    );
    this.adSetsService.fetchAdSetsDataFromApi();
    this.logger.log('Completed cron job...');
  }
}
