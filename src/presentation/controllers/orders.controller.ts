import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CreateOrderDto } from 'src/application/dto/create-order.dto';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.usecase';
import { FindOrderByIdUseCase } from 'src/application/use-cases/find-order-by-id.usecase';
import { FindAllOrdersUseCase } from 'src/application/use-cases/find-all-orders.usecase';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
  ) {}

  @Get()
  async findAll() {
    const orders = await this.findAllOrdersUseCase.execute();
    return {
      message: 'Orders retrieved successfully',
      data: orders,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.findOrderByIdUseCase.execute(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return {
      message: 'Order retrieved successfully',
      data: order,
    };
  }

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    const orderData = {
      customerId: dto.customerId,
      items: dto.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    const orderResponse = await this.createOrderUseCase.execute(orderData);
    return {
      message: 'Order created successfully',
      data: orderResponse,
    };
  }
}
