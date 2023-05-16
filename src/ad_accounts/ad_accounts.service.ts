import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { AdAccountsEntity } from './ad_accounts.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateAdAccountDto } from './dto/create-adaccounts.dto';

@Injectable()
export class AdAccountsService {

    constructor(
        //@InjectRepository(AdAccountsEntity)
        //private readonly adAccountsRepository: EntityRepository<AdAccountsEntity>,
        private readonly em: EntityManager,
    ){}
    
    // Create
    async create(dto: CreateAdAccountDto): Promise<void> {

        const {accountId,source,name,status,timeZone} = dto;

        // create new ad account
        const adAccount = new AdAccountsEntity(source,accountId,name,timeZone,status);
        await this.em.persistAndFlush(adAccount);
    }
}
