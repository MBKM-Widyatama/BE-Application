import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from 'src/models/users/services/users.service';
import { RolesService } from 'src/models/roles/services/roles.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly UsersService: UsersService,
    private readonly RolesService: RolesService,
  ) {}

  @Get('users')
  async findAllUsers() {
    return this.UsersService.findAllUsers();
  }

  @Post('sign-up')
  @HttpCode(201)
  @Throttle(3, 60)
  async signUp(@Body() body: CreateUserDto) {
    const defaultRole = await this.RolesService.findRoleByName('Super Admin');
    console.log(defaultRole, 'defaultRole');

    const payload = {
      ...body,
      roleId: defaultRole.id,
    };
    const result = await this.UsersService.createUser(payload);

    return {
      message: 'User created successfully',
      result,
    };
  }
}
