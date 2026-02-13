import { Inject, Injectable } from '@nestjs/common';
import type { EventBusPort } from 'src/domain/ports/event-bus.port';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('EventBusPort') private readonly eventBus: EventBusPort,
  ) {}

  async execute(command: CreateOrderDto): Promise<void> {
    console.log('execute usecase', command);
    await this.eventBus.emitEvent('OrderCreated', {
      orderId: command.orderId,
      userId: command.userId,
      status: command.status,
      totalAmount: command.totalAmount,
    });
  }
}
