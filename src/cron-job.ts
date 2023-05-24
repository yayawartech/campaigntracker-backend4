import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExternalAPIService } from './external_api/external_api.service';

@Injectable()
export class TrackerCronJob {
  constructor(
    private readonly extAPIService: ExternalAPIService,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron(): Promise<any> {
    this.logger.log("Running cron job...");
    const startDate = '2023-05-21T00:00:00';
    const endDate='2023-05-21T00:00:00';
    const data = await this.extAPIService.fetchExternalApiData(startDate,endDate);
    this.logger.log("Completed cron job...");
  }
}
