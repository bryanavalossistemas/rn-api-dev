import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { AuthProvidersService } from '../auth-providers/auth-providers.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authProvidersService: AuthProvidersService,
  ) {}

  async save(user: DeepPartial<User>) {
    return await this.userRepository.save(user);
  }

  async findOneBy(where: FindOptionsWhere<User>) {
    return await this.userRepository.findOneBy(where);
  }

  async findOne(options: FindOneOptions<User>) {
    return await this.userRepository.findOne(options);
  }

  async addProvider(provider: string, providerId: string, user: User) {
    return await this.authProvidersService.save({
      provider,
      providerId,
      user,
    });
  }
}
