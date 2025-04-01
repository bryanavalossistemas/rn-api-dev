import { AuthProvidersService } from '@/auth/modules/auth-providers/auth-providers.service';
import { AuthProvider } from '@/auth/modules/auth-providers/entities/auth-provider.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuthProvider])],
  providers: [AuthProvidersService],
  exports: [AuthProvidersService],
})
export class AuthProvidersModule {}
