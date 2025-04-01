import { Profile } from '@/auth/modules/profiles/entities/profile.entity';
import { ProfilesService } from '@/auth/modules/profiles/profiles.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
