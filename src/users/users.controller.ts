import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

//@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Get()
  async findUsers(){
      return this.userService.findAllUsers();
  }

  @Get(':id')
  async findAdAccount(@Param('id') id: string){
      return this.userService.findUser(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string){
      return this.userService.deleteUser(id);
  }

  @Put(':id')
  async updateuser(@Body() userData: CreateUserDto, @Param('id') id: string){
        return this.userService.updateUser(id,userData);
    }


}
