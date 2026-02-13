import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './presentation/controllers/orders.controller';
import { RabbitmqModule } from './infrastructure/rabbitmq/rabbitmq.module';
import { CreateOrderUseCase } from './application/use-cases/create-order.usecase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitmqModule,
  ],
  controllers: [OrdersController],
  providers: [CreateOrderUseCase],
})
export class AppModule {}
