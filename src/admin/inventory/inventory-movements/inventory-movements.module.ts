import { InventoryMovement } from '@/admin/inventory/inventory-movements/entities/inventory-movement.entity';
import { InventoryMovementsService } from '@/admin/inventory/inventory-movements/inventory-movements.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovement])],
  providers: [InventoryMovementsService],
  exports: [InventoryMovementsService],
})
export class InventoryMovementsModule {}
