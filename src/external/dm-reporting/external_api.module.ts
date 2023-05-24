import { Logger, Module } from '@nestjs/common';
import { ExternalAPIService } from './external_api.service';
import { ExternalAPIController } from './external_api.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ExternalAPIEntity } from './external_api.entity';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
  providers: [ExternalAPIService,Logger],
  controllers: [ExternalAPIController],
  exports: [ExternalAPIService],
  imports: [MikroOrmModule.forFeature({ entities: [ExternalAPIEntity] }),PaginationModule,],
})
export class ExternalAPIModule {}
