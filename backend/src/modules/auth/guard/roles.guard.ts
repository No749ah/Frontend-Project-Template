import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/userrole.entity';

export const RoleHierarchy = {
  ADMIN: ['ADMIN', 'USER'],
  USER: ['USER'],
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    return this.hasHigherOrEqualRole(user.role, requiredRoles);
  }

  private hasHigherOrEqualRole(
    userRole: UserRole,
    requiredRoles: UserRole[],
  ): boolean {
    const userRoleHierarchy = RoleHierarchy[userRole];
    return requiredRoles.some((requiredRole) =>
      userRoleHierarchy.includes(requiredRole),
    );
  }
}
