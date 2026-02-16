import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './presentation/controllers/orders.controller';
import { RabbitmqModule } from './infrastructure/rabbitmq/rabbitmq.module';
import { CreateOrderUseCase } from './application/use-cases/create-order.usecase';
import { FindOrderByIdUseCase } from './application/use-cases/find-order-by-id.usecase';
import { FindAllOrdersUseCase } from './application/use-cases/find-all-orders.usecase';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { OrderRepository } from './infrastructure/prisma/order.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitmqModule,
    PrismaModule,
  ],
  controllers: [OrdersController],
  providers: [
    CreateOrderUseCase,
    FindOrderByIdUseCase,
    FindAllOrdersUseCase,
    {
      provide: 'OrderRepository', // token de inyección
      useClass: OrderRepository, // implementación concreta
    },
  ],
})
export class AppModule {}
