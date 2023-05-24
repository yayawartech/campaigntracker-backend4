import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdAccountsEntity } from './ad_accounts.entity';
import { AdAccountDto } from './dto/create-adaccounts.dto';

@Injectable()
export class AdAccountsService {
  constructor(
    @InjectRepository(AdAccountsEntity)
    private readonly adAccountsRepository: EntityRepository<AdAccountsEntity>,
    private readonly em: EntityManager,
  ) {}
  // CREATE (POST) - Create a new Ad Accounts
  // Parameters:UserData: (source,accountID,name,timeZone,status) in Object Form
  async create(
    dto: AdAccountDto,
  ): Promise<{ message: string; data: AdAccountsEntity }> {
    const { accountId, source, name, status, timeZone } = dto;

    const existingAccount = await this.adAccountsRepository.findOne({
      accountId: accountId,
      // source: source,
    });

    if (existingAccount) {
      throw new HttpException(
        {
          message: 'Ad Account already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    const adAccount = new AdAccountsEntity(
      source,
      accountId,
      name,
      timeZone,
      status,
    );
    await this.em.persistAndFlush(adAccount);
    return {
      message: 'Ad account created successfully',
      data: adAccount,
    };
  }

  // Retrieve all AdAccounts
  async findAllAdAccounts(): Promise<AdAccountsEntity[]> {
    return await this.adAccountsRepository.findAll();
  }

  // READ (GET) - find Ad Accounts by accountID
  // Parameters: accountID: The accountID of the Ad Accounts
  async findAdAccount(accountId: string): Promise<AdAccountsEntity | null> {
    return await this.adAccountsRepository.findOne({ accountId });
  }

  // DELETE (DELETE) - Delete Ad Accounts by accountId
  // Parameters:
  // - accountId: The ID of the Ad Accounts to delete

  async deleteAdAccount(
    accountId: string,
  ): Promise<{ message: string; data: AdAccountsEntity }> {
    const entityToDelete = await this.em.findOne(AdAccountsEntity, {
      accountId: accountId,
    });

    await this.em.removeAndFlush(entityToDelete);
    return {
      message: 'Ad account deleted successfully',
      data: entityToDelete,
    };
  }

  // UPDATE (PUT) - Update Adaccounts details by accountsId
  // Parameters:
  // - accountId: The ID of the AdAcounts to update
  // - updatedAdaccountData: An object containing the updated user data

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
