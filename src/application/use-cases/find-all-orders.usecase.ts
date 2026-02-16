import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/infrastructure/prisma/order.repository';
import { OrderDtoMapper } from '../mappers/order-dto.mapper';
import { OrderResponseDto } from '../dto/order-response.dto';

@Injectable()
export class FindAllOrdersUseCase {
  constructor(
    @Inject('OrderRepository') private readonly orderRepo: OrderRepository,
  ) {}

  async execute(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.findAll();
    return orders.map(order => OrderDtoMapper.toResponse(order));
  }
}