import { Controller, Get, Param, Query } from '@nestjs/common';

import { ExternalAPIService } from './external_api.service';
import {Request} from 'express'
import { ExternalAPIEntity } from './external_api.entity';
//@UseGuards(CustomCookieGuard)
@Controller('campaigns')
export class ExternalAPIController {
  constructor(private readonly extAPIService: ExternalAPIService) {}

  // Controller methods here
  @Get()
  async fetchExternalApiData(@Query('page') page: number, @Query('pageSize') pageSize: number): Promise<PaginationResponse<ExternalAPIEntity>> {

    const resp = await this.extAPIService.findAll(page, pageSize);
    return resp
  }
}
