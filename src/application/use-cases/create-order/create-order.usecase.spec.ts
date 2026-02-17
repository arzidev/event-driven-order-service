import { CreateOrderUseCase } from './create-order.usecase';
import { IOrderRepository } from '@domain/repositories/order.repository';
import { EventBusPort } from '@domain/ports/event-bus.port';
import { Order } from '@domain/entities/order.entity';
import { OrderItem } from '@domain/entities/order-item.entity';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let eventBus: jest.Mocked<EventBusPort>;

  beforeEach(() => {
    orderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    eventBus = {
      emitEvent: jest.fn().mockResolvedValue(undefined),
      sendEvent: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<EventBusPort>;

    useCase = new CreateOrderUseCase(orderRepository, eventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create an order with one item and emit event', async () => {
      const mockOrder = new Order({
        id: 'order-1',
        customerId: 'customer-1',
        status: 'created',
        items: [
          new OrderItem({
            id: 'item-1',
            orderId: 'order-1',
            productId: 'product-1',
            quantity: 2,
            price: 100,
          }),
        ],
      });

      orderRepository.create.mockResolvedValue(mockOrder);

      const result = await useCase.execute({
        customerId: 'customer-1',
        items: [{ productId: 'product-1', quantity: 2 }],
      });

      // Resultado
      expect(result.customerId).toBe('customer-1');
      expect(result.status).toBe('created');
      expect(result.total).toBe(200);
      expect(result.items).toHaveLength(1);

      // Interacción con repo
      expect(orderRepository.create).toHaveBeenCalledTimes(1);
      expect(orderRepository.create).toHaveBeenCalledWith(expect.any(Order));

      // Evento emitido
      expect(eventBus.emitEvent).toHaveBeenCalledWith(
        'OrderCreated',
        expect.objectContaining({
          id: 'order-1',
          customerId: 'customer-1',
          status: 'created',
          total: 200,
        }),
      );
    });

    it('should calculate total correctly with multiple items', async () => {
      const mockOrder = new Order({
        id: 'order-2',
        customerId: 'customer-1',
        status: 'created',
        items: [
          new OrderItem({
            id: 'item-1',
            orderId: 'order-2',
            productId: 'product-1',
            quantity: 3,
            price: 100,
          }),
          new OrderItem({
            id: 'item-2',
            orderId: 'order-2',
            productId: 'product-2',
            quantity: 1,
            price: 100,
          }),
        ],
      });

      orderRepository.create.mockResolvedValue(mockOrder);

      const result = await useCase.execute({
        customerId: 'customer-1',
        items: [
          { productId: 'product-1', quantity: 3 },
          { productId: 'product-2', quantity: 1 },
        ],
      });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(400);
      expect(orderRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should not emit event if repository throws error', async () => {
      orderRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(
        useCase.execute({
          customerId: 'customer-1',
          items: [{ productId: 'product-1', quantity: 2 }],
        }),
      ).rejects.toThrow('Database error');

      expect(eventBus.emitEvent).not.toHaveBeenCalled();
    });
  });
});
