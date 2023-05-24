import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdAccountsModule } from './ad_accounts/ad_accounts.module';
import { TrackerCronJob } from './cron-job';
import { ExternalAPIModule } from './external/dm-reporting/external_api.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    ExternalAPIModule,
    AdAccountsModule,
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [AppService,TrackerCronJob,Logger],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
  }
}
