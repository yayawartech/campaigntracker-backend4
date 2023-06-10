import { Module } from '@nestjs/common';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaginationModule } from 'src/pagination/pagination.module';

@Module({
  controllers: [AutomationController],
  providers: [AutomationService],
  imports: [PrismaModule, PaginationModule],
})
export class AutomationModule {}
