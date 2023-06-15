import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Automation, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAutomationDto } from './dto/CreateAutomation.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { Logger } from '@nestjs/common';

interface Rule {
  id: number;
  param: string;
  days?: string;
  operand: string;
  types: string;
  daysAgo: string;
  daysCompareTo: string;
  dollarValue: string;
  percentValue: string;
  display_text: string;
}

interface JoinList {
  [alias: string]: string;
}

interface WithList {
  [alias: string]: string;
}

@Injectable()
export class AutomationService {
  constructor(
    private prisma: PrismaService,
    private readonly paginationService: PaginationService<Automation>,
    private readonly logger: Logger,
  ) {}

  async storeAutomation(createAutomationDto: CreateAutomationDto) {
    const formattedRowsPromises = await createAutomationDto.data.map((data) => {
      return this.formatData(data);
    });
    const formattedRows = await Promise.all(formattedRowsPromises);

    const jsonRules = JSON.stringify(formattedRows);
    const automationData = await this.prisma.automation.create({
      data: {
        rules: jsonRules,
        name: createAutomationDto.name,
        automationInMinutes: createAutomationDto.automationInMinutes,
        budgetType: createAutomationDto.budgetType,
        options: createAutomationDto.options,
        status: createAutomationDto.status,
      },
    });
    return automationData;
  }

  async formatData(data) {
    let display_text: string = '';
    if ('param' in data && data['param']) {
      display_text += data.param + ' ';
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

    if ('dollarValue' in data && data['dollarValue']) {
      display_text += data.dollarValue + ' ';
    }
    if ('daysCompareTo' in data && data['daysCompareTo']) {
      display_text += data.daysCompareTo + ' days ago ';
    }
    if ('percentValue' in data && data['percentValue']) {
      display_text += data.percentValue + '%';
    }
    return { ...data, displayText: display_text };
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
        name: automation.name,
        options: automation.options,
        budgetType: automation.budgetType,
        status: automation.status,
        automationInMinutes: automation.automationInMinutes,
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
          message: 'Automation not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const formattedRowsPromises = await createAutomationDto.data.map((data) => {
      return this.formatData(data);
    });
    const formattedRows = await Promise.all(formattedRowsPromises);
    const jsonRules = JSON.stringify(formattedRows);
    const automation = await this.prisma.automation.update({
      where: { id },
      data: {
        rules: jsonRules,
        name: createAutomationDto.name,
        automationInMinutes: createAutomationDto.automationInMinutes,
        budgetType: createAutomationDto.budgetType,
        options: createAutomationDto.options,
        status: createAutomationDto.status,
      },
    });
    return {
      message: 'Automation updated successfully',
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
          errors: { email: 'Automation not found' },
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

  //GET QUERY FROM DATABASE

  async runAutomation(): Promise<boolean> {
    this.logger.log('Started Cron Job for RunAutomation');
    try {
      const automations = await this.prisma.automation.findMany();
      const results: boolean[] = [];

      await Promise.all(
        automations.map((automation) => {
          const rules = JSON.parse(automation.rules) as Rule[];
          const query = this.generateQuery(rules);

          if (query) {
            const res = this.prisma.$executeRaw(Prisma.sql`${query}`);
            if (Array.isArray(res) && res.length > 1) {
              results.push(true);
            } else {
              results.push(false);
            }
          }
        }),
      );
      this.logger.log('End Cron Job for Run Automation');
      return results.includes(false) ? false : true;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // Author: Manjul Bhattarai
  // Service for Query Builder based on automation rules
  async generateQuery(rules: Rule[]): Promise<string> {
    const [whereList, joinList, withList] = this.buildQueryPartials(rules);

    let query = 'WITH\n';

    const withEntries = Object.values(withList);
    for (let i = 0; i < withEntries.length; i++) {
      query += withEntries[i];
      if (i !== withEntries.length - 1) {
        query += ',';
      }
      query += '\n';
    }

    const select = 'SELECT * FROM AdSets t1\n';
    query += select;

    const joinEntries = Object.values(joinList);
    for (const entry of joinEntries) {
      query += entry;
    }

    let whereClause = 'WHERE\n';
    for (let i = 0; i < whereList.length; i++) {
      if (i === 0) {
        whereClause += whereList[i] + '\n';
      } else {
        whereClause += 'AND ' + whereList[i] + '\n';
      }
    }

    query += whereClause + ';';

    return query;
  }

  buildQueryPartials(rules: Rule[]): [string[], JoinList, WithList] {
    const whereList: string[] = [];
    const joinList: JoinList = {};
    const withList: WithList = {};

    for (const rule of rules) {
      const param = rule.param;

      if (param === 'current_budget') {
        const operand = rule.operand;
        const value = rule.dollarValue;
        const condition = `t1.daily_budget`;
        whereList.push(this.generateWhere(condition, operand, value));
      } else if (param === 'adset_age') {
        const operand = rule.operand;
        const value = rule.daysCompareTo;
        const condition = '(TO_DAYS(NOW()) - TO_DAYS(t1.start_time))';
        whereList.push(this.generateWhere(condition, operand, value));
      } else if (param === 'margin' || param === 'gross_profit') {
        const operand = rule.operand;
        const types = rule.types;
        const daysAgo = rule.daysAgo;
        const daysCompareTo = rule.daysCompareTo;
        const percentValue = rule.percentValue;
        const dollarValue = rule.dollarValue;

        const days: string[] = [];
        if (types === 'timeframe') {
          days.push(daysAgo);
          days.push(daysCompareTo);
        } else {
          days.push(daysAgo);
        }

        const conditions: string[] = [];
        for (const day of days) {
          const [alias, withQuery] = this.generateWith(param, day);
          withList[alias] = withQuery;
          joinList[alias] = this.generateJoin(alias);
          if (types === 'number') {
            let condition = `${alias}.${param}`;
            let value = '';
            if (param === 'gross_profit') {
              value = dollarValue;
            } else {
              value = percentValue;
            }
            whereList.push(this.generateWhere(condition, operand, value));
          } else {
            const condition = `${alias}.${param}`;
            conditions.push(condition);
          }
        }

        if (types === 'timeframe') {
          whereList.push(
            this.generateWhere(conditions[0], operand, conditions[1]),
          );
        }
      }
    }

    return [whereList, joinList, withList];
  }

  generateWhere(condition: string, operand: string, value: string): string {
    const query = `${condition} ${operand} ${value}`;
    return query;
  }

  generateWith(param: string, day: string): [string, string] {
    const alias = param + day;
    const withQuery = `\t${alias} AS (SELECT * FROM TestData WHERE reportDate = DATE_SUB(CURDATE(), INTERVAL ${day} DAY))`;
    return [alias, withQuery];
  }

  generateJoin(alias: string): string {
    const joinQuery = `\tJOIN ${alias} ON t1.adset_id = ${alias}.adset_id\n`;
    return joinQuery;
  }
}
