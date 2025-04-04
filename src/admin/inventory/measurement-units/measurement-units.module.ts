import { MeasurementUnit } from '@/admin/inventory/measurement-units/entities/measurement-unit.entity';
import { MeasurementUnitsController } from '@/admin/inventory/measurement-units/measurement-units.controller';
import { MeasurementUnitsService } from '@/admin/inventory/measurement-units/measurement-units.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MeasurementUnit])],
  controllers: [MeasurementUnitsController],
  providers: [MeasurementUnitsService],
})
export class MeasurementUnitsModule {}
