import { Logger, Module } from '@nestjs/common';
import { DMReportingService } from './dm_reporting.service';
import { DMReportingController } from './dm_reporting.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DMReportingEntity } from './dm_reporting.entity';
import { PaginationModule } from 'src/pagination/pagination.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [DMReportingService, Logger],
  controllers: [DMReportingController],
  exports: [DMReportingService],
  imports: [
    MikroOrmModule.forFeature({ entities: [DMReportingEntity] }),
    PaginationModule,
    PrismaModule,
  ],
})
export class DMReportingModule {}
