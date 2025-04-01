import { Profile } from '@/auth/modules/profiles/entities/profile.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  async save(profile: DeepPartial<Profile>) {
    return await this.profilesRepository.save(profile);
  }
}
