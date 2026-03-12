import { Test, TestingModule } from '@nestjs/testing';
import { FindOrderByIdUseCase } from './find-order-by-id.usecase';
import {
  buildMockOrder,
  createOrderRepositoryMock,
} from './find-order-by-id.mocks';

describe('FindOrderByIdUseCase', () => {
  let useCase: FindOrderByIdUseCase;
  let orderRepository: ReturnType<typeof createOrderRepositoryMock>;

  const mockOrder = buildMockOrder();

  beforeEach(async () => {
    const mockOrderRepository = createOrderRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOrderByIdUseCase,
        {
          provide: 'OrderRepository',
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindOrderByIdUseCase>(FindOrderByIdUseCase);
    orderRepository = module.get('OrderRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return order when found', async () => {
      // Arrange
      const orderId = 'test-order-id';
      orderRepository.findById.mockResolvedValue(mockOrder);

      // Act
      const result = await useCase.execute(orderId);

      // Assert
      expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(
        expect.objectContaining({
          id: 'test-order-id',
          customerId: 'test-customer',
          status: 'created',
          total: 200,
          items: expect.arrayContaining([
            expect.objectContaining({
              productId: 'product-1',
              quantity: 2,
              price: 100,
            }),
          ]),
        }),
      );
    });

    it('should return null when order not found', async () => {
      // Arrange
      const orderId = 'non-existent-id';
      orderRepository.findById.mockResolvedValue(null);

      // Act
      const result = await useCase.execute(orderId);

      // Assert
      expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      // Arrange
      const orderId = 'test-order-id';
      orderRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute(orderId)).rejects.toThrow('Database error');
    });

    it('should call repository with correct parameters', async () => {
      // Arrange
      const orderId = 'specific-order-id';
      orderRepository.findById.mockResolvedValue(null);

      // Act
      await useCase.execute(orderId);

      // Assert
      expect(orderRepository.findById).toHaveBeenCalledTimes(1);
      expect(orderRepository.findById).toHaveBeenCalledWith(
        'specific-order-id',
      );
    });
  });
});
