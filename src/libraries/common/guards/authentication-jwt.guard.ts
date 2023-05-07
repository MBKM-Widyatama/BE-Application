import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthenticationJWTGuard extends AuthGuard('authentication-jwt') {}
