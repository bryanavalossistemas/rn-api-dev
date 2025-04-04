// src/websockets/websockets.module.ts
import { Module } from '@nestjs/common';
import { ProductUpdatesGateway } from './product-updates.gateway';

@Module({
  providers: [ProductUpdatesGateway],
  exports: [ProductUpdatesGateway], // ¡Importante exportarlo para usarlo en otros módulos!
})
export class WebSocketsModule {}
