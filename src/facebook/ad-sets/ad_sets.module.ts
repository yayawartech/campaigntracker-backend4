import { Logger, Module } from '@nestjs/common';
import { AdSetsController } from './ad_sets.controller';
import { AdSetsService } from './ad_sets.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PaginationModule } from 'src/pagination/pagination.module';
import { AdSetsEntity } from './ad_sets.entity';
import { AdAccountsService } from 'src/ad_accounts/ad_accounts.service';
import { AdAccountsEntity } from 'src/ad_accounts/ad_accounts.entity';

@Module({
  controllers: [AdSetsController],
  providers: [AdSetsService, AdAccountsService, Logger],
  exports: [AdSetsService],
  imports: [
    MikroOrmModule.forFeature({ entities: [AdSetsEntity, AdAccountsEntity] }),
    PaginationModule,
  ],
})
export class AdSetsModule {}
