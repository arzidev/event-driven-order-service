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

export const buildMockOrders = () => [
  buildOrder({
    id: 'order-1',
    customerId: 'customer-1',
    items: [{ id: 'item-1', productId: 'product-1', quantity: 2, price: 50 }],
  }),
  buildOrder({
    id: 'order-2',
    customerId: 'customer-2',
    items: [
      { id: 'item-2', productId: 'product-2', quantity: 1, price: 100 },
      { id: 'item-3', productId: 'product-3', quantity: 3, price: 25 },
    ],
  }),
];
