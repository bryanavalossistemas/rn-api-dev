import { AuthProvidersService } from '@/auth/modules/auth-providers/auth-providers.service';
import { User } from '@/auth/modules/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

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
}
