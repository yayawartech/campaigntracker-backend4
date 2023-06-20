import { AdSetsService } from './facebook/ad-sets/ad_sets.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DMReportingService } from './external/dm-reporting/dm_reporting.service';
import { AutomationService } from './automation/automation.service';
import { RUN_CRON } from './config';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(timezone);
dayjs.extend(utc);
@Injectable()
export class TrackerCronJob {
  constructor(
    private readonly extAPIService: DMReportingService,
    private readonly dmReportingCronService: DMReportingService,
    private readonly adSetsService: AdSetsService,
    private readonly automationService: AutomationService,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleCron(): Promise<any> {
    if (!this.runCron()) {
      return;
    }
    const dateTime = dayjs().tz('America/New_York');
    const previousDate = dateTime.subtract(1, 'day').format('YYYY-MM-DD');
    await this.extAPIService.fetchExternalApiData(previousDate, previousDate);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async adSetsCron(): Promise<void> {
    if (!this.runCron()) {
      return;
    }

    const dateTime = dayjs().tz('America/New_York');
    const currentDate = dateTime.format('YYYY-MM-DD');
    await this.extAPIService.fetchExternalApiData(currentDate, currentDate);
    await this.adSetsService.fetchAdSetsDataFromApi();
    await this.automationService.runAutomation();
  }

  runCron(): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return RUN_CRON === 'yes';
  }
}
