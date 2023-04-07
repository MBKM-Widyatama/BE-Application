import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

// Dtos
import { CreateUserDto } from '../dto/create-user.dto';
// import { SignInUserDto } from '../dto/signin-user.dto';

// Services
import { UsersService } from 'src/models/users/services/users.service';
import { RolesService } from 'src/models/roles/services/roles.service';

// Throttler
import { Throttle } from '@nestjs/throttler';

// Passport
import { AuthPublicLocalGuard } from 'src/libraries/common';
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

  @Post('sign-in')
  @HttpCode(200)
  @Throttle(3, 60)
  @UseGuards(AuthPublicLocalGuard)
  async signInByEmail(@Request() request) {
    const result = await this.UsersService.signInByEmail(request.user);

    return {
      message: 'User logged in successfully',
      result,
    };
  }

  @Post('sign-up')
  @HttpCode(201)
  @Throttle(3, 60)
  async signUp(@Body() body: CreateUserDto) {
    const defaultRole = await this.RolesService.findRoleByName('Super Admin');

    const payload = {
      ...body,
      role_id: defaultRole.id,
    };
    const result = await this.UsersService.createUser(payload);

    return {
      message: 'User created successfully',
      result,
    };
  }
}
