import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthProvidersModule } from '../auth-providers/auth-providers.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthProvidersModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
