import { ExtractJwt } from 'passport-jwt';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SingleSignOnService } from 'src/models/single-sign-on/services/single-sign-on.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private singleSignOnService: SingleSignOnService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.switchToHttp().getRequest(),
    );

    const sso = await this.singleSignOnService.findByValidToken(token);
    if (!sso.menu) return false;

    const isExists = sso.menu.find((el) => {
      return requiredRoles.includes(el.NavUrl);
    });

    if (!isExists) return false;

    return true;
  }
}
