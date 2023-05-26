import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { AdAccountsEntity } from './ad_accounts.entity';
import { AdAccountDto } from './dto/create-adaccounts.dto';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class AdAccountsService {
  constructor(
    @InjectRepository(AdAccountsEntity)
    private readonly adAccountsRepository: EntityRepository<AdAccountsEntity>,
    private readonly paginationService: PaginationService<AdAccountsEntity>,
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
  async findAllAdAccounts(page: number = 1, pageSize: number = 10): Promise<PaginationResponse<AdAccountsEntity>> {
    const query = this.adAccountsRepository.createQueryBuilder();
    query.offset((page - 1) * pageSize).limit(pageSize);
    const [items,totalItems]  = await query.getResultAndCount();
    return this.paginationService.getPaginationData(page,pageSize,items,totalItems)
  }

  async findAllAccounts(): Promise<AdAccountsEntity[]> {
    return await this.adAccountsRepository.findAll();
  }


  

  // READ (GET) - find Ad Accounts by accountID
  // Parameters: id: The accountID of the Ad Accounts
  async findAdAccount(id: string): Promise<AdAccountsEntity | null> {
    return await this.adAccountsRepository.findOne({ id });
  }

  // DELETE (DELETE) - Delete Ad Accounts by accountId
  // Parameters:
  // - id: The ID of the Ad Accounts to delete

  async deleteAdAccount(
    id: string,
  ): Promise<{ message: string; data: AdAccountsEntity }> {
    const entityToDelete = await this.em.findOne(AdAccountsEntity, {
      id: id,
    });

    await this.em.removeAndFlush(entityToDelete);
    return {
      message: 'Ad account deleted successfully',
      data: entityToDelete,
    };
  }

  // UPDATE (PUT) - Update Adaccounts details by accountsId
  // Parameters:
  // - id: The ID of the AdAcounts to update
  // - updatedAdaccountData: An object containing the updated user data

  async updateAdAccount(
    id: string,
    adAccountData: AdAccountDto,
  ): Promise<{message: string; data: AdAccountsEntity }> {
    const entityToUpdate = await this.adAccountsRepository.findOne({
      id: id,
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
    return {
      message: 'Ad account deleted successfully',
      data: entityToUpdate,
    };
  }
}
