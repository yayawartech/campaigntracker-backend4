import { PaginationService } from 'src/pagination/pagination.service';
import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: EntityRepository<UsersEntity>,
    private readonly paginationService:PaginationService<UsersEntity>, 
    private readonly em: EntityManager,
  ) {}

  // CREATE (POST) - Create a new user
  // Parameters:UserData: (name,email,password) in Object Form

  async create(
    dto: CreateUserDto,
  ): Promise<{ message: string; data: UsersEntity }> {
    // check uniqueness of username/email

    const { name, email, password } = dto;

    const exists = await this.userRepository.count({ $or: [{ email }] });

    if (exists > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { email: 'Email is already taken' },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new user
    const user = new UsersEntity(name, email, password);
    await this.em.persistAndFlush(user);
    return {
      message: 'User created successfully',
      data: user,
    };
  }

  // READ (GET) - find user by email
  // Parameters: userEmail: The email of the user

  async findUserByEmail(email: string): Promise<UsersEntity | null> {
    return await this.userRepository.findOne({ email: email });
  }

  // Get All Users

  async findAllUsers(page: number = 1,pageSize:number = 10): Promise<PaginationResponse<UsersEntity>> {
    const query = this.userRepository.createQueryBuilder();
    query.offset((page - 1) * pageSize).limit(pageSize);
    const [items,totalItems] = await query.getResultAndCount();
    return this.paginationService.getPaginationData(page,pageSize,items,totalItems)
  }

  // READ (GET) - Get user details by ID
  // Parameters:
  // - userId: The ID of the user to fetch
  // Returns: Single user instance

  async findUser(id: string): Promise<UsersEntity | null> {
    return await this.userRepository.findOne({ id });
  }

  // UPDATE (PUT) - Update user details by ID
  // Parameters:
  // - userId: The ID of the user to update
  // - updatedUserData: An object containing the updated user data

  async updateUser(id: string, userData: CreateUserDto): Promise<{message: string; data: UsersEntity}> {
    const entityToUpdate = await this.userRepository.findOne({ id });
    if (!entityToUpdate) {
      throw new HttpException(
        {
          message: 'User Account not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    // Update all properties at once

    Object.assign(entityToUpdate, userData);
    await this.em.flush();
    return {
      message: 'User updated successfully',
      data: entityToUpdate,
    };
  }

  // DELETE (DELETE) - Delete user by ID
  // Parameters:
  // - userId: The ID of the user to delete

  async deleteUser(
    id: string,
  ): Promise<{ message: string; data: UsersEntity }> {
    const entityToDelete = await this.em.findOne(UsersEntity, { id: id });
    if (!entityToDelete) {
      throw new HttpException(
        {
          message: 'User Account not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.em.removeAndFlush(entityToDelete);
    return {
      message: 'User deleted successfully',
      data: entityToDelete,
    };
  }
}
