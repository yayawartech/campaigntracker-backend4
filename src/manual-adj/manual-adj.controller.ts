import { Get, Controller, Query, Post, Body, Param } from '@nestjs/common';
import { ManualAdjService } from './manual-adj.service';
import { ManualAdjustment } from '@prisma/client';
import { ManualAdjDto } from './dto/manual-adj.dto';

@Controller('manual-adj')
export class ManualAdjController {

    constructor(private readonly manualAdj: ManualAdjService) { }

    @Get()
    async getAllManualAdj(
        @Query('page') page: number,
        @Query('pageSize') pageSize: number,
        @Query('fromDate') fromDate: string,
        @Query('toDate') toDate: string,
        @Query('sort') sort: any,
        @Query('AdsetName') AdsetName: string,
        @Query('day') day: string,
        @Query('facebook_campaign') facebook_campaign: string,
        @Query('term_filter') term_filter: string,
        @Query('spend_min') spend_min: number,
        @Query('spend_max') spend_max: number,
        @Query('rpc_min') rpc_min: number,
        @Query('rpc_max') rpc_max: number,
        @Query('margin_min') margin_min: number,
        @Query('margin_max') margin_max: number,
        @Query('gp_min') gp_min: number,
        @Query('gp_max') gp_max: number,
        @Query('ctr_min') ctr_min: number,
        @Query('ctr_max') ctr_max: number,


    ) {
        const res = await this.manualAdj.getAllAutomations(
            page,
            pageSize,
            sort,
            day,
            facebook_campaign,
            term_filter,
            spend_min,
            spend_max,
            rpc_min,
            rpc_max,
            margin_min,
            margin_max,
            gp_min,
            gp_max,
            ctr_max,
            ctr_min

        )
        return res
    }
    @Post()
    async postManualAdj(
        @Body() manualadjData: ManualAdjDto
    ) {
        return this.manualAdj.storeManualData(manualadjData)
    }

    @Get('test')
    async fetchedDataFromDb() {
        return this.fetchedDataFromDb()
    }
}
