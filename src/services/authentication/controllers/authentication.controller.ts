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

  @Post('sign-in')
  @HttpCode(200)
  @Throttle(60, 60)
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
  @Throttle(60, 60)
  async signUp(@Body() requestBody: CreateUserDto) {
    const defaultRole = await this.RolesService.findRoleByName('Super Admin');

    const payload = {
      ...requestBody,
      role_id: requestBody.role_id ?? defaultRole.id,
    };
    const result = await this.UsersService.createUser(payload);

    return {
      message: 'User created successfully',
      result,
    };
  }

  @Post('forgot-password')
  @HttpCode(200)
  @Throttle(60, 60)
  async forgotPassword(@Body() requestBody) {
    const result = await this.UsersService.forgotPassword(requestBody.email);

    return {
      message: 'Forgot password successfully',
      result,
    };
  }
}
