import { Module } from '@nestjs/common';
import { DocumentDetailsService } from './document-details.service';
import { DocumentDetail } from './entities/document-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentDetail])],
  providers: [DocumentDetailsService],
  exports: [DocumentDetailsService],
})
export class DocumentDetailsModule {}
