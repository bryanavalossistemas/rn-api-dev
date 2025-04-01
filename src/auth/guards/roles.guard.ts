import { IS_PUBLIC_KEY } from '@/auth/decorators/is-public.decorator';
import { ROLES_KEY } from '@/auth/decorators/roles.decorator';
import { User } from '@/auth/modules/users/entities/user.entity';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

interface Payload {
  sub: User['id'];
  email: User['email'];
  role: 'admin' | 'employee' | 'user';
}

declare module 'express' {
  interface Request {
    user: Payload;
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

    if (!user.role) {
      throw new UnauthorizedException();
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
