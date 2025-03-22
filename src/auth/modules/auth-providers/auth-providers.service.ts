import { Injectable } from '@nestjs/common';
import { AuthProvider } from './entities/auth-provider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class AuthProvidersService {
  constructor(
    @InjectRepository(AuthProvider)
    private readonly authProviderRepository: Repository<AuthProvider>,
  ) {}

  async save(authProvider: DeepPartial<AuthProvider>) {
    return await this.authProviderRepository.save(authProvider);
  }
}
