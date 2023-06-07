import { AdSetsService } from './facebook/ad-sets/ad_sets.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DMReportingService } from './external/dm-reporting/dm_reporting.service';

@Injectable()
export class TrackerCronJob {
  constructor(
    private readonly extAPIService: DMReportingService,
    private readonly dmReportingCronService: DMReportingService,
    private readonly adSetsService: AdSetsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleCron(): Promise<any> {
    const startDate = '2023-05-21T00:00:00';
    const endDate = '2023-05-21T00:00:00';
    this.extAPIService.fetchExternalApiData(startDate, endDate);
    this.adSetsService.fetchAdSetsDataFromApi();
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async dmReportingCron(): Promise<void> {
    await this.dmReportingCronService.DmReportingCronJob();
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async adSetsCron(): Promise<void> {
    await this.adSetsService.AdSetsCronJob();
  }
}
