import { Module } from '@nestjs/common';
import { InventoryMovementsService } from './inventory-movements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryMovement } from './entities/inventory-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovement])],
  providers: [InventoryMovementsService],
  exports: [InventoryMovementsService],
})
export class InventoryMovementsModule {}
