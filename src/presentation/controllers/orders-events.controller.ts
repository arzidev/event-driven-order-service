import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('orders')
export class OrdersController {
  constructor() {}

  @EventPattern('OrderCreated')
  handleOrderCreated(data: any) {
    console.log('llega el evento', data);
  }
}
