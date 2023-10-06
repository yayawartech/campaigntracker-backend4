import { Injectable, Logger } from '@nestjs/common';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ManualAdjData } from './ManualAdjData';
import { ManualAdjDto } from './dto/manual-adj.dto';
import { ManualAdjustment, Prisma } from '@prisma/client';
@Injectable()
export class ManualAdjService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
    private readonly paginationService: PaginationService<ManualAdjData>,

  ) { }

  async storeManualData(createDto: ManualAdjDto): Promise<ManualAdjustment[]> {
    const updateData: ManualAdjustment[] = await Promise.all(
      createDto.data.map(async (item) => {
        const {
          id, new_budget, duplicate, duplicate_budget
        } = item;
        const existingData = await this.prisma.manualAdjustment.findUnique({
          where: { id },
        })
        if (!existingData) {
          throw Error(`Data unavilable ${id}`)
        }
        return this.prisma.manualAdjustment.update({
          where: { id },
          data: {
            new_budget: Number(new_budget),
            duplicate: Number(duplicate),
            duplicate_budget: Number(duplicate_budget)
          }
        })
      })

    )
    return updateData
  }

  async getAllAutomations(
    page: number = 1,
    pageSize: number = 10,
    sort: any,
    day: string = "",
    facebook_campaign: string = "",
    term_filter: string = "",
    spend_min: string = '',
    spend_max: string = '',
    rpc_min: string = '',
    rpc_max: string = '',
    margin_min: string = '',
    margin_max: string = '',
    gp_min: string = '',
    gp_max: string = '',
    ctr_min: string = '',
    ctr_max: string = '',

  ) {

    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const whereData = {
      day: day,
      facebook_campaign: facebook_campaign,
      term_filter: term_filter,

    }

    const havingData = {
      spend_min: spend_min,
      spend_max: spend_max,
      rpc_min: rpc_min,
      rpc_max: rpc_max,
      margin_min: margin_min,
      margin_max: margin_max,
      gp_min: gp_min,
      gp_max: gp_max,
      ctr_min: ctr_min,
      ctr_max: ctr_max
    }
    let whereQuery = this.generateWhereQuery(whereData)
    
    let havingQuery = this.generateHavingQuery(havingData)
  
    let orderByColumn = 'gp'
    let orderByDirection = 'asc';

    if (sort) {
      const validSortColumns = ['gp', 'RPC', 'CPA', 'Spend', 'Revenue', 'Margin', 'AdClicks', 'Current_Budget', 'adset_id'];


      if (validSortColumns.includes(sort.column)) {
        orderByColumn = sort.column
      }

      if (sort.direction === 'desc') {
        orderByDirection = 'desc'
      }
    }

    let queryStr = `
      SELECT
      t1.gp,
      t3.RPC,
      t2.name as AdsetName,
      10 as CTR,
      (SUM(t1.spend) / SUM(t1.ad_clicks)) AS CPA,
      SUM(t1.spend) AS Spend,
      SUM(t1.revenue) AS Revenue,
      (
        (SUM(t1.revenue) - SUM(t1.spend)) / NULLIF(SUM(t1.revenue), 0)
      ) * 100 AS Margin,
      SUM(t1.ad_clicks) AS AdClicks,
      t2.daily_budget AS Current_Budget,
      t1.adset_id 
    FROM
      DmReporting t1
       JOIN AdSets t2 ON t1.adset_id = t2.adset_id
       JOIN CategoryRPC t3 ON t1.category = t3.category
       ${whereQuery}
    GROUP BY
      t1.gp,
      t3.RPC,
      t1.adset_id,
      t1.adset
      ${havingQuery}
    ORDER BY ${orderByColumn} ${orderByDirection}
    LIMIT ${skip}, ${take};`
    
    const query = Prisma.raw(queryStr);


    console.log("Query to be executed", queryStr)

    const dataFromquery: any = await this.prisma.$queryRaw(query)
    
    const mappedData: ManualAdjData[] = dataFromquery.map((row) => ({
      gp: row.gp,
      RPC: row.RPC,
      CPA: row.CPA,
      Spend: row.Spend,
      Revenue: row.Revenue,
      Margin: row.Margin,
      AdClicks: row.AdClicks,
      Current_Budget: row.Current_Budget,
      adset_id: row.adset_id,
      AdsetName: row.AdsetName
    }))
    // console.log("Mapped Data", mappedData)
    const totalItems = mappedData.length

    const currentPageData = mappedData.slice(skip, skip + pageSize);
    const paginationResponse = await this.paginationService.getPaginationData(
      page,
      pageSize,
      currentPageData,
      totalItems
    );
    return paginationResponse
  }

  generateHavingQuery(havingData) {

    const havingConditions = [];

    if (havingData.spend_min !== '' && havingData.spend_max !== '') {
      havingConditions.push(`Spend BETWEEN ${havingData.spend_min} AND ${havingData.spend_max}`);
    }

    if (havingData.rpc_min !== '' && havingData.rpc_max !== '') {
      havingConditions.push(`t3.RPC BETWEEN ${havingData.rpc_min} AND ${havingData.rpc_max}`);
    }

    if (havingData.margin_min !== '' && havingData.margin_max !== '') {
      havingConditions.push(`Margin BETWEEN ${havingData.margin_min} AND ${havingData.margin_max}`);
    }

    if (havingData.gp_min !== '' && havingData.gp_max !== '') {
      havingConditions.push(`t1.gp BETWEEN ${havingData.gp_min} AND ${havingData.gp_max}`);
    }
    
    if (havingData.ctr_min !== '' && havingData.ctr_max !== '') {
      havingConditions.push(`CTR BETWEEN ${havingData.ctr_min} AND ${havingData.ctr_max}`);
    }
    return havingConditions.length > 0 ? `HAVING ${havingConditions.join(' AND ')}` : '';


  }
  generateWhereQuery(whereData) {
    let conditions = []

    if (whereData.day === 'today') {
      const today = new Date()
      const formattedDate = today.toISOString().split('T')[0];
      conditions.push(`DATE(t2.created_time) = '${formattedDate}'`)
    } else if (whereData.day == 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayFormatted = yesterday.toISOString().split('T')[0]
      conditions.push(`DATE(t2.created_time) = '${yesterdayFormatted}'`)
    }
    
    if (whereData.facebook_campaign !== '') {
      conditions.push(`t2.name = '${whereData.facebook_campaign}'`)
    }

    if (whereData.term_filter !== '') {
      conditions.push(`t2.name LIKE '%${whereData.term_filter}%'`)
    }

    return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  }

}
