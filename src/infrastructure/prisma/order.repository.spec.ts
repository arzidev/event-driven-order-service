import { OrderRepository } from './order.repository';
import { PrismaService } from './prisma.service';
import { Order } from '@domain/entities/order.entity';
import { OrderItem } from '@domain/entities/order-item.entity';

describe('OrderRepository', () => {
  let prisma: {
    order: { create: jest.Mock; findUnique: jest.Mock; findMany: jest.Mock };
  };
  let repository: OrderRepository;

  beforeEach(() => {
    prisma = {
      order: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    };
    repository = new OrderRepository(prisma as unknown as PrismaService);
  });

  it('should create an order and map result to entity', async () => {
    const order = new Order({
      id: 'order-1',
      customerId: 'customer-1',
      status: 'created',
      items: [
        new OrderItem({
          id: 'item-1',
          orderId: 'order-1',
          productId: 'product-1',
          quantity: 2,
          price: 50,
        }),
      ],
    });
    prisma.order.create.mockResolvedValue({
      id: 'order-1',
      customerId: 'customer-1',
      status: 'created',
      total: 100,
      createdAt: new Date('2026-02-19T00:00:00.000Z'),
      updatedAt: new Date('2026-02-19T01:00:00.000Z'),
      items: [
        {
          id: 'item-1',
          orderId: 'order-1',
          productId: 'product-1',
          quantity: 2,
          price: 50,
        },
      ],
    });

    const result = await repository.create(order);
    expect(prisma.order.create).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Order);
    expect(result.id).toBe('order-1');
    expect(result.getItems()).toHaveLength(1);
  });

  it('should find order by id and map to entity', async () => {
    prisma.order.findUnique.mockResolvedValue({
      id: 'order-2',
      customerId: 'customer-2',
      status: 'created',
      createdAt: new Date('2026-02-19T00:00:00.000Z'),
      updatedAt: new Date('2026-02-19T01:00:00.000Z'),
      items: [
        {
          id: 'item-2',
          orderId: 'order-2',
          productId: 'product-2',
          quantity: 1,
          price: 100,
        },
      ],
    });
    const result = await repository.findById('order-2');
    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: 'order-2' },
      include: { items: true },
    });
    expect(result).toBeInstanceOf(Order);
    expect(result?.id).toBe('order-2');
    expect(result?.getItems()[0].productId).toBe('product-2');
  });

  it('should return null if order not found', async () => {
    prisma.order.findUnique.mockResolvedValue(null);
    const result = await repository.findById('not-exist');
    expect(result).toBeNull();
  });

  it('should find all orders and map to entities', async () => {
    prisma.order.findMany.mockResolvedValue([
      {
        id: 'order-3',
        customerId: 'customer-3',
        status: 'created',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 'item-3',
            orderId: 'order-3',
            productId: 'product-3',
            quantity: 2,
            price: 10,
          },
        ],
      },
    ]);
    const result = await repository.findAll();
    expect(prisma.order.findMany).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Order);
    expect(result[0].getItems()[0].productId).toBe('product-3');
  });
});
