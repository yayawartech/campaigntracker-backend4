import { AdSetsService } from './facebook/ad-sets/ad_sets.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DMReportingService } from './external/dm-reporting/dm_reporting.service';
import { AutomationService } from './automation/automation.service';

@Injectable()
export class TrackerCronJob {
  constructor(
    private readonly extAPIService: DMReportingService,
    private readonly dmReportingCronService: DMReportingService,
    private readonly adSetsService: AdSetsService,
    private readonly automationService: AutomationService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron(): Promise<any> {
    const currentDate = new Date();
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);

    const startDate = previousDate.toISOString().substring(0, 10);
    const endDate = previousDate.toISOString().substring(0, 10);
    await this.extAPIService.fetchExternalApiData(startDate, endDate);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async adSetsCron(): Promise<void> {
    await this.adSetsService.fetchAdSetsDataFromApi();
    await this.automationService.runAutomation();
  }
}
