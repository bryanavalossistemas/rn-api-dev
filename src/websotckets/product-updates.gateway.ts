import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Product } from '@/admin/inventory/products/entities/product.entity';

@WebSocketGateway({
  namespace: '/product-updates',
  cors: { origin: '*' },
})
export class ProductUpdatesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger = new Logger('WebSocket');

  afterInit() {
    this.logger.debug(`WebSocket Server iniciado`);
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('subscribeToProduct')
  async handleSubscribe(client: Socket, payload: { productId: number }) {
    this.logger.log(`✅ Suscripción CONFIRMADA para producto: ${payload.productId}`);
    await client.join(`product_${payload.productId}`);
  }

  public notifyProductUpdate(productId: number, updatedProduct: Product) {
    this.server.to(`product_${productId}`).emit(`productUpdated:${productId}`, updatedProduct);
    this.server.emit('productListUpdated', {
      id: updatedProduct.id,
      changes: updatedProduct,
    });
  }
}
