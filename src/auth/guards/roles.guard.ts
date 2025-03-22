import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user: {
      sub: number;
      email: string;
      roles: string[];
    };
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]) ?? ['admin'];

    const { user } = context.switchToHttp().getRequest<Request>();

    if (!user?.roles?.length) {
      throw new UnauthorizedException();
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
