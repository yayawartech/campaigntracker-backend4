import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/mysql';
import { UsersEntity } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: EntityRepository<UsersEntity>,
    private readonly em: EntityManager,
  ) {}

  // create user
  async create(dto: CreateUserDto): Promise<void> {
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
  }

  // find user by email
  async findUserByEmail(email: string): Promise<UsersEntity | null> {
    return await this.userRepository.findOne({ email: email });
  }

  // Get All Users
  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.userRepository.findAll();
  }

  // Get User by Id
  async findUser(id: string): Promise<UsersEntity | null> {
    return await this.userRepository.findOne({ id });
  }

  // Update User
  async updateUser(id: string, userData: CreateUserDto): Promise<UsersEntity> {
    const entityToUpdate = await this.userRepository.findOne({ id });
    if (!entityToUpdate) {
      throw new HttpException(
        {
          message: 'User Account not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    Object.assign(entityToUpdate, userData); // Update all properties at once
    await this.em.flush();
    return entityToUpdate;
  }

  // Delete User
  async deleteUser(id: string): Promise<void> {
    const entityToDelete = await this.em.findOne(UsersEntity, { id });

    return await this.em.removeAndFlush(entityToDelete);
  }
}
