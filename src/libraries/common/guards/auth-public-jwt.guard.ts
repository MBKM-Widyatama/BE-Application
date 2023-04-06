import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthPublicJwtGuard extends AuthGuard('auth-public-jwt') {}
