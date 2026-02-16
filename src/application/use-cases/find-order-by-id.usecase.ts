import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/infrastructure/prisma/order.repository';
import { OrderDtoMapper } from '../mappers/order-dto.mapper';
import { OrderResponseDto } from '../dto/order-response.dto';

@Injectable()
export class FindOrderByIdUseCase {
  constructor(
    @Inject('OrderRepository') private readonly orderRepo: OrderRepository,
  ) {}

  async execute(id: string): Promise<OrderResponseDto | null> {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      return null;
    }
    return OrderDtoMapper.toResponse(order);
  }
}
