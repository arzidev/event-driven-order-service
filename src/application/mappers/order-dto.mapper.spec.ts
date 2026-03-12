import { OrderDtoMapper } from './order-dto.mapper';
import { Order } from '@domain/entities/order.entity';
import { OrderItem } from '@domain/entities/order-item.entity';

describe('OrderDtoMapper', () => {
  it('should map order total correctly', () => {
    // Arrange
    const createdAt = new Date('2026-02-19T10:00:00.000Z');
    const order = new Order({
      id: 'order-1',
      customerId: 'customer-1',
      status: 'created',
      createdAt,
      items: [
        new OrderItem({
          id: 'item-1',
          orderId: 'order-1',
          productId: 'product-1',
          quantity: 2,
          price: 50,
        }),
        new OrderItem({
          id: 'item-2',
          orderId: 'order-1',
          productId: 'product-2',
          quantity: 1,
          price: 100,
        }),
      ],
    });

    // Act
    const result = OrderDtoMapper.toResponse(order);

    // Assert
    expect(result.total).toBe(200);
  });

  it('should map items with productId quantity and price', () => {
    // Arrange
    const order = new Order({
      id: 'order-2',
      customerId: 'customer-2',
      status: 'created',
      items: [
        new OrderItem({
          id: 'item-1',
          orderId: 'order-2',
          productId: 'product-1',
          quantity: 3,
          price: 10,
        }),
      ],
    });

    // Act
    const result = OrderDtoMapper.toResponse(order);

    // Assert
    expect(result.items).toEqual([
      {
        productId: 'product-1',
        quantity: 3,
        price: 10,
      },
    ]);
  });

  it('should keep createdAt from domain entity', () => {
    // Arrange
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const order = new Order({
      id: 'order-3',
      customerId: 'customer-3',
      status: 'created',
      createdAt,
      items: [
        new OrderItem({
          id: 'item-1',
          orderId: 'order-3',
          productId: 'product-3',
          quantity: 1,
          price: 999,
        }),
      ],
    });

    // Act
    const result = OrderDtoMapper.toResponse(order);

    // Assert
    expect(result.createdAt).toBe(createdAt);
  });
});
