import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthAdminJwtGuard extends AuthGuard('auth-admin-jwt') {}
