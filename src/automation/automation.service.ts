import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Automation, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAutomationDto } from './dto/CreateAutomation.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { Row } from './Row';

@Injectable()
export class AutomationService {
  constructor(
    private prisma: PrismaService,
    private readonly paginationService: PaginationService<Automation>,
  ) {}

  async storeAutomation(createAutomationDto: CreateAutomationDto) {
    const formattedRowsPromises = await createAutomationDto.data.map((data) => {
      return this.formatData(data);
    });
    const formattedRows = await Promise.all(formattedRowsPromises);
    //console.log(formattedRows);
    const jsonRules = JSON.stringify(formattedRows);
    const automationData = await this.prisma.automation.create({
      data: {
        rules: jsonRules,
      },
    });
    return automationData;
  }

  async formatData(data) {
    let display_text: string = '';
    if ('params' in data && data['params']) {
      display_text += data.params + ' ';
    }
    if ('daysAgo' in data && data['daysAgo']) {
      display_text += data.daysAgo + ' days ';
    }
    if ('operand' in data && data['operand']) {
      display_text += data.operand + ' ';
    }
    if ('daysValue' in data && data['daysValue']) {
      display_text += data.daysValue + ' days ';
    }

    if ('value' in data && data['value']) {
      display_text += data.value + ' ';
    }
    // if ('types' in data && data['types']) {
    //   display_text += data.types + ' ';
    // }

    if ('daysValue' in data && data['daysValue']) {
      display_text += data.days + ' ';
    }
    if ('dolorValue' in data && data['dolorValue']) {
      display_text += data.dolorValue + ' ';
    }
    if ('daysAgoValue' in data && data['daysAgoValue']) {
      display_text += data.daysAgoValue + ' days ago ';
    }
    if ('percentValue' in data && data['percentValue']) {
      display_text += data.percentValue + '%';
    }
    return { ...data, display_text: display_text };
  }

  async getAllAutomations(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginationResponse<Automation>> {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);
    const automations = await this.prisma.automation.findMany({
      skip,
      take,
    });
    const formattedAutomations = automations.map((automation) => {
      return {
        id: automation.id,
        rules: JSON.parse(automation.rules),
        createdAt: automation.createdAt,
        updatedAt: automation.updatedAt,
      };
    });
    const totalItems = await this.prisma.user.count(); // Count total number of items
    return this.paginationService.getPaginationData(
      page,
      pageSize,
      formattedAutomations,
      totalItems,
    );
  }

  async updateData(
    id: number,
    createAutomationDto: CreateAutomationDto,
  ): Promise<{ message: string; data: Automation }> {
    const entityToUpdate = await this.prisma.automation.findUnique({
      where: { id },
    });
    if (!entityToUpdate) {
      throw new HttpException(
        {
          message: 'Ad Account not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const jsonRules = JSON.stringify(createAutomationDto.data);
    const automation = await this.prisma.automation.update({
      where: { id },
      data: {
        rules: jsonRules,
      },
    });
    return {
      message: 'Ad account updated successfully',
      data: automation,
    };
  }

  async deleteData(id: number): Promise<{ message: string }> {
    const entityToDelete = await this.prisma.automation.findUnique({
      where: { id },
    });
    if (!entityToDelete) {
      throw new HttpException(
        {
          message: 'Input Request',
          errors: { email: 'Add Account not found' },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const automation = await this.prisma.automation.delete({ where: { id } });
    return {
      message: 'Automation deleted successfully',
    };
  }

  async findAutomation(id: number): Promise<Automation | null> {
    return await this.prisma.automation.findUnique({ where: { id } });
  }
}
