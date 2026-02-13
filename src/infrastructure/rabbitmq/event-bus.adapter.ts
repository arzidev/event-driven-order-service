import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventBusPort } from 'src/domain/ports/event-bus.port';

export class EventBusAdapter implements EventBusPort {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async emitEvent(pattern: string, payload: any): Promise<void> {
    await this.client.emit(pattern, payload);
  }

  async sendEvent(pattern: string, payload: any): Promise<any> {
    return await this.client.send(pattern, payload);
  }
}
