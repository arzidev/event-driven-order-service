import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventBusAdapter } from './event-bus.adapter';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>(
                'RABBITMQ_URL',
                'amqp://guest:guest@localhost:5672',
              ),
            ],
            queue: configService.get<string>('RABBITMQ_QUEUE', 'orders'),
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: 'EventBusPort',
      useClass: EventBusAdapter,
    },
  ],
  exports: ['EventBusPort'],
})
export class RabbitmqModule {}
