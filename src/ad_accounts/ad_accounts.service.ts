import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdAccountsEntity } from './ad_accounts.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AdAccountDto } from './dto/create-adaccounts.dto';

@Injectable()
export class AdAccountsService {
  constructor(
    @InjectRepository(AdAccountsEntity)
    private readonly adAccountsRepository: EntityRepository<AdAccountsEntity>,
    private readonly em: EntityManager,
  ) {}

  async create(dto: AdAccountDto): Promise<void> {
    const { accountId, source, name, status, timeZone } = dto;

    const adAccount = new AdAccountsEntity(
      source,
      accountId,
      name,
      timeZone,
      status,
    );
    await this.em.persistAndFlush(adAccount);
  }

  // Retrieve all
  async findAllAdAccounts(): Promise<AdAccountsEntity[]> {
    return await this.adAccountsRepository.findAll();
  }

  // Retrieve Single Ad Account
  async findAdAccount(accountId: string): Promise<AdAccountsEntity | null> {
    return await this.adAccountsRepository.findOne({ accountId });
  }

  // Delete an Ad Account
  async deleteAdAccount(accountId: string): Promise<void> {
    const entityToDelete = await this.em.findOne(AdAccountsEntity, {
      id: accountId,
    });

    return await this.em.removeAndFlush(entityToDelete);
  }

  // Update an Ad Account
  async updateAdAccount(
    accountId: string,
    adAccountData: AdAccountDto,
  ): Promise<AdAccountsEntity> {
    const entityToUpdate = await this.adAccountsRepository.findOne({
      id: accountId,
    });
    if (!entityToUpdate) {
      throw new HttpException(
        {
          message: 'Ad Account not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    Object.assign(entityToUpdate, adAccountData); // Update all properties at once
    entityToUpdate.updatedDate = new Date();
    await this.em.flush();
    return entityToUpdate;
  }
}
