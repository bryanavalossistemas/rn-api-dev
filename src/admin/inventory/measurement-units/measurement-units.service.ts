import { CreateMeasurementUnitDto } from '@/admin/inventory/measurement-units/dto/create-measurement-unit.dto';
import { MeasurementUnit } from '@/admin/inventory/measurement-units/entities/measurement-unit.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MeasurementUnitsService {
  constructor(
    @InjectRepository(MeasurementUnit)
    private readonly measurementUnitsRepository: Repository<MeasurementUnit>,
  ) {}

  async create(createMeasurementUnitDto: CreateMeasurementUnitDto) {
    return await this.measurementUnitsRepository.save(createMeasurementUnitDto);
  }

  async findAll() {
    return await this.measurementUnitsRepository.find();
  }
}
