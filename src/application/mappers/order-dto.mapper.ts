import { Order } from '@domain/entities/order.entity';

export class OrderDtoMapper {
  static toResponse(order: Order) {
    return {
      id: order.id,
      customerId: order.customerId,
      total: order.total,
      items: order.getItems().map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      status: order.status,
      createdAt: order.createdAt,
    };
  }
}
