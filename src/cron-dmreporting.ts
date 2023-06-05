import { DMReportingService } from './external/dm-reporting/dm_reporting.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DmReportingCronJob {
  constructor(
    private readonly prism: PrismaService,
    private readonly dmReportingCronService: DMReportingService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async dmReportingCron(): Promise<void> {
    await this.dmReportingCronService.DmReportingCronJob();
  }
}
