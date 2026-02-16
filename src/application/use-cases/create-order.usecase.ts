import { Inject, Injectable } from '@nestjs/common';
import type { EventBusPort } from 'src/domain/ports/event-bus.port';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderRepository } from 'src/infrastructure/prisma/order.repository';
import { OrderDtoMapper } from '../mappers/order-dto.mapper';
import { OrderResponseDto } from '../dto/order-response.dto';
import { randomUUID } from 'crypto';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { Order } from 'src/domain/entities/order.entity';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('EventBusPort') private readonly eventBus: EventBusPort,
    @Inject('OrderRepository') private readonly orderRepo: OrderRepository,
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
