import { CreateMeasurementUnitDto } from '@/admin/inventory/measurement-units/dto/create-measurement-unit.dto';
import { MeasurementUnitsService } from '@/admin/inventory/measurement-units/measurement-units.service';
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('measurement-units')
export class MeasurementUnitsController {
  constructor(private readonly measurementUnitsService: MeasurementUnitsService) {}

  @Post()
  async create(@Body() createMeasurementUnitDto: CreateMeasurementUnitDto) {
    return await this.measurementUnitsService.create(createMeasurementUnitDto);
  }

  @Get()
  async findAll() {
    return await this.measurementUnitsService.findAll();
  }
}
