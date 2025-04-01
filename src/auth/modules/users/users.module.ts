import { AuthProvidersModule } from '@/auth/modules/auth-providers/auth-providers.module';
import { User } from '@/auth/modules/users/entities/user.entity';
import { UsersService } from '@/auth/modules/users/users.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthProvidersModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
