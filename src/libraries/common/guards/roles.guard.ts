import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestUserPassport } from 'src/models/users/interfaces/users.interface';

// import { SingleSignOnService } from 'src/models/single-sign-on/services/single-sign-on.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * @description Validate roles
   * @param roles string[]
   * @param userRole string
   * @returns
   */
  private matchRoles(roles: string[], userRole: string): boolean {
    return roles.includes(userRole);
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: IRequestUserPassport = request.user;

    return this.matchRoles(requiredRoles, user.role.name);
  }
}
