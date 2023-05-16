import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersEntity } from './users.entity';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
  imports: [MikroOrmModule.forFeature({ entities: [UsersEntity] })],
})
export class UsersModule {}
