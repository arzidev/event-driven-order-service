import { IOrderRepository } from '@domain/repositories/order.repository';
import { Order } from '@domain/entities/order.entity';
import { OrderItem } from '@domain/entities/order-item.entity';

export const createOrderRepositoryMock = (): jest.Mocked<IOrderRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

export const buildMockOrder = () =>
  new Order({
    id: 'test-order-id',
    customerId: 'test-customer',
    status: 'created',
    items: [
      new OrderItem({
        id: 'test-item-id',
        orderId: 'test-order-id',
        productId: 'product-1',
        quantity: 2,
        price: 100,
      }),
    ],
  });
