import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AutomationLogDto } from './dto/AutomationLog.dto';
import { Logger } from '@nestjs/common';
import { AutomationLog } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class AutomationlogService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly paginationService: PaginationService<AutomationLog>,
  ) {}

  async createAutomationLog(dto: AutomationLogDto): Promise<void> {
    try {
      await this.prisma.automationLog.create();
    } catch (error) {
      console.error('Error creating automation log:', error);
      throw error;
    }
  }

  async findAllAutomationLog(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginationResponse<AutomationLog>> {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);
    const automationlogs = await this.prisma.automationLog.findMany({
      skip,
      take,
    });
    const totalItems = await this.prisma.automationLog.count(); // Count total number of items

    return this.paginationService.getPaginationData(
      page,
      pageSize,
      automationlogs,
      totalItems,
    );
  }
}

// Create a method to insert into database
// View
