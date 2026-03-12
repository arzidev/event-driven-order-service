import { Test, TestingModule } from '@nestjs/testing';
import { FindAllOrdersUseCase } from './find-all-orders.usecase';
import {
  buildMockOrders,
  createOrderRepositoryMock,
} from './find-all-orders.mocks';

describe('FindAllOrdersUseCase', () => {
  let useCase: FindAllOrdersUseCase;
  let orderRepository: ReturnType<typeof createOrderRepositoryMock>;

  const mockOrders = buildMockOrders();

  beforeEach(async () => {
    const mockOrderRepository = createOrderRepositoryMock();

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
