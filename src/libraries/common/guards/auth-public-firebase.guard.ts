import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthPublicFirerbaseGuard extends AuthGuard(
  'auth-public-firebase',
) {}
