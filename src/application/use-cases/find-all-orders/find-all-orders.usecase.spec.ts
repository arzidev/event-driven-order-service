import { Test, TestingModule } from '@nestjs/testing';
import { FindAllOrdersUseCase } from './find-all-orders.usecase';
import { IOrderRepository } from '@domain/repositories/order.repository';
import { Order } from '@domain/entities/order.entity';
import { OrderItem } from '@domain/entities/order-item.entity';

describe('FindAllOrdersUseCase', () => {
  let useCase: FindAllOrdersUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;

  const mockOrders = [
    new Order({
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
    }),
    new Order({
      id: 'order-2',
      customerId: 'customer-2',
      status: 'created',
      items: [
        new OrderItem({
          id: 'item-2',
          orderId: 'order-2',
          productId: 'product-2',
          quantity: 1,
          price: 100,
        }),
        new OrderItem({
          id: 'item-3',
          orderId: 'order-2',
          productId: 'product-3',
          quantity: 3,
          price: 25,
        }),
      ],
    }),
  ];

  beforeEach(async () => {
    const mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllOrdersUseCase,
        {
          provide: 'OrderRepository',
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllOrdersUseCase>(FindAllOrdersUseCase);
    orderRepository = module.get('OrderRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return all orders when orders exist', async () => {
      // Arrange
      orderRepository.findAll.mockResolvedValue(mockOrders);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(orderRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'order-1',
          customerId: 'customer-1',
          status: 'created',
          total: 100,
          items: expect.arrayContaining([
            expect.objectContaining({
              productId: 'product-1',
              quantity: 2,
              price: 50,
            }),
          ]),
        }),
      );
      expect(result[1]).toEqual(
        expect.objectContaining({
          id: 'order-2',
          customerId: 'customer-2',
          status: 'created',
          total: 175, // (1 * 100) + (3 * 25)
          items: expect.arrayContaining([
            expect.objectContaining({
              productId: 'product-2',
              quantity: 1,
              price: 100,
            }),
            expect.objectContaining({
              productId: 'product-3',
              quantity: 3,
              price: 25,
            }),
          ]),
        }),
      );
    });

    it('should return empty array when no orders exist', async () => {
      // Arrange
      orderRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(orderRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      // Arrange
      orderRepository.findAll.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Database error');
    });

    it('should transform domain entities to DTOs correctly', async () => {
      // Arrange
      const singleOrder = [mockOrders[0]];
      orderRepository.findAll.mockResolvedValue(singleOrder);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result[0]).toEqual({
        id: 'order-1',
        customerId: 'customer-1',
        status: 'created',
        total: 100,
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            price: 50,
          },
        ],
        createdAt: expect.any(Date),
      });
    });
  });
});
