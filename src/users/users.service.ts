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

  async findUserByEmail(email: string): Promise<UsersEntity | null> {
    return await this.userRepository.findOne({ email: email });
  }
}
