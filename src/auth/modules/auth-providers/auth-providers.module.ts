import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthProvider } from './entities/auth-provider.entity';
import { AuthProvidersService } from './auth-providers.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthProvider])],
  providers: [AuthProvidersService],
  exports: [AuthProvidersService],
})
export class AuthProvidersModule {}
