import { Body, Controller, Post } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CreateOrderDto } from 'src/application/dto/create-order.dto';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.usecase';

@Controller('orders')
export class OrdersController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<{ message: string }> {
    await this.createOrderUseCase.execute(dto);
    return {
      message: 'Order created successfully',
    };
  }

  @EventPattern('OrderCreated')
  handleOrderCreated(data: any) {
    console.log('llega el evento', data);
  }
}
