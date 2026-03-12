import { IOrderRepository } from '@domain/repositories/order.repository';
import { EventBusPort } from '@domain/ports/event-bus.port';
import { Order } from '@domain/entities/order.entity';
import { OrderItem } from '@domain/entities/order-item.entity';

export const createOrderRepositoryMock = (): jest.Mocked<IOrderRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

export const createEventBusMock = (): jest.Mocked<EventBusPort> =>
  ({
    emitEvent: jest.fn().mockResolvedValue(undefined),
    sendEvent: jest.fn().mockResolvedValue(undefined),
  }) as jest.Mocked<EventBusPort>;

export const buildOrder = (params: {
  id: string;
  customerId: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
  }>;
  status?: string;
}) =>
  new Order({
    id: params.id,
    customerId: params.customerId,
    status: params.status ?? 'created',
    items: params.items.map(
      (item) =>
        new OrderItem({
          id: item.id,
          orderId: params.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        }),
    ),
  });
