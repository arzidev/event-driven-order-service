import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateOrderDto } from '@application/dto/create-order.dto';
import { CreateOrderUseCase } from '@application/use-cases/create-order/create-order.usecase';
import { FindAllOrdersUseCase } from '@application/use-cases/find-all-orders/find-all-orders.usecase';
import { FindOrderByIdUseCase } from '@application/use-cases/find-order-by-id/find-order-by-id.usecase';

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
