import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DMReportingService } from './external/dm-reporting/dm_reporting.service';

@Injectable()
export class TrackerCronJob {
  constructor(
    private readonly extAPIService: DMReportingService,
    private readonly dmReportingCronService: DMReportingService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron(): Promise<any> {
    const startDate = '2023-05-21T00:00:00';
    const endDate = '2023-05-21T00:00:00';
    this.extAPIService.fetchExternalApiData(startDate, endDate);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async dmReportingCron(): Promise<void> {
    await this.dmReportingCronService.DmReportingCronJob();
  }
}
