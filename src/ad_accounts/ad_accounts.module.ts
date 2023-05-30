import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AdAccountsEntity } from './ad_accounts.entity';
import { AdAccountsController } from './ad_accounts.controller';
import { AdAccountsService } from './ad_accounts.service';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
    providers: [AdAccountsService],
    controllers: [AdAccountsController],
    exports: [AdAccountsService],
    imports: [MikroOrmModule.forFeature({ entities: [AdAccountsEntity] }),PaginationModule,],
  })
export class AdAccountsModule {}
