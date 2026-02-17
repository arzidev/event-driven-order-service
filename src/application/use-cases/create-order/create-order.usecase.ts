import { Inject, Injectable } from '@nestjs/common';
import type { EventBusPort } from '@domain/ports/event-bus.port';
import { CreateOrderDto } from '@application/dto/create-order.dto';
import { OrderDtoMapper } from '@application/mappers/order-dto.mapper';
import { OrderResponseDto } from '@application/dto/order-response.dto';
import { randomUUID } from 'crypto';
import { OrderItem } from '@domain/entities/order-item.entity';
import { Order } from '@domain/entities/order.entity';
import type { IOrderRepository } from '@domain/repositories/order.repository';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('OrderRepository') private readonly orderRepo: IOrderRepository,
    @Inject('EventBusPort') private readonly eventBus: EventBusPort,
  ) {}

  async execute(orderData: CreateOrderDto): Promise<OrderResponseDto> {
    const orderId = randomUUID();
    const items: OrderItem[] = [];
    for (const item of orderData.items) {
      //TODO: consultar productoService para obtener datos del producto
      items.push(
        new OrderItem({
          id: randomUUID(),
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: 100,
        }),
      );
    }
    const orderToCreate = new Order({
      id: orderId,
      customerId: orderData.customerId,
      status: 'created',
      items,
    });
    const savedOrder = await this.orderRepo.create(orderToCreate);
    const orderDto = OrderDtoMapper.toResponse(savedOrder);
    await this.eventBus.emitEvent('OrderCreated', orderDto);
    return orderDto;
  }
}
