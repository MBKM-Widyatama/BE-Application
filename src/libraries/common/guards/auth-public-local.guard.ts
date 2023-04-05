import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthPublicLocalGuard extends AuthGuard('auth-public-local') {}
