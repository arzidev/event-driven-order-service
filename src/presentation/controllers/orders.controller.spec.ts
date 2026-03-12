import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { CreateOrderUseCase } from '@application/use-cases/create-order/create-order.usecase';
import { FindAllOrdersUseCase } from '@application/use-cases/find-all-orders/find-all-orders.usecase';
import { FindOrderByIdUseCase } from '@application/use-cases/find-order-by-id/find-order-by-id.usecase';

describe('OrdersController', () => {
  let controller: OrdersController;
  let createOrderUseCase: { execute: jest.Mock };
  let findAllOrdersUseCase: { execute: jest.Mock };
  let findOrderByIdUseCase: { execute: jest.Mock };

  beforeEach(async () => {
    createOrderUseCase = { execute: jest.fn() };
    findAllOrdersUseCase = { execute: jest.fn() };
    findOrderByIdUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: CreateOrderUseCase, useValue: createOrderUseCase },
        { provide: FindAllOrdersUseCase, useValue: findAllOrdersUseCase },
        { provide: FindOrderByIdUseCase, useValue: findOrderByIdUseCase },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should return all orders', async () => {
    (findAllOrdersUseCase.execute as jest.Mock).mockResolvedValue([
      { id: 'order-1' },
    ]);
    const result = await controller.findAll();
    expect(result.data).toEqual([{ id: 'order-1' }]);
  });

  it('should return one order', async () => {
    (findOrderByIdUseCase.execute as jest.Mock).mockResolvedValue({
      id: 'order-2',
    });
    const result = await controller.findOne('order-2');
    expect(result.data).toEqual({ id: 'order-2' });
  });

  it('should throw NotFoundException if order not found', async () => {
    (findOrderByIdUseCase.execute as jest.Mock).mockResolvedValue(null);
    await expect(controller.findOne('not-exist')).rejects.toThrow(
      'Order not found',
    );
  });

  it('should create an order', async () => {
    (createOrderUseCase.execute as jest.Mock).mockResolvedValue({
      id: 'order-3',
    });
    const dto = { customerId: 'c1', items: [{ productId: 'p1', quantity: 1 }] };
    const result = await controller.create(dto as any);
    expect(result.data).toEqual({ id: 'order-3' });
  });
});
