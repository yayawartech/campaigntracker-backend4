import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersEntity } from './users.entity';
import { PaginationModule } from 'src/pagination/pagination.module';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  providers: [UsersService,PaginationService],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [MikroOrmModule.forFeature({ entities: [UsersEntity] }),PaginationModule],
})
export class UsersModule {}
