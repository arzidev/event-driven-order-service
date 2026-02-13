import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Crear aplicación HTTP
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // // Conectar microservice de RabbitMQ para CONSUMIR eventos
  app.connectMicroservice<MicroserviceOptions>({
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
  });

  // Iniciar todos los microservicios conectados
  await app.startAllMicroservices();

  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);
  app.enableCors();

  // Levantar HTTP server
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(
    `🚀 Order Service running on http://localhost:${port}/${apiPrefix}`,
  );
  console.log(
    `📨 Connected to RabbitMQ queue: ${configService.get<string>('RABBITMQ_QUEUE', 'orders_queue')}`,
  );
}
bootstrap();
