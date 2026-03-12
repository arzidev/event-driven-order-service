import { EventBusAdapter } from './event-bus.adapter';

describe('EventBusAdapter', () => {
  let client: any;
  let adapter: EventBusAdapter;

  beforeEach(() => {
    client = { emit: jest.fn(), send: jest.fn() };
    adapter = new EventBusAdapter(client);
  });

  it('should emit event', async () => {
    client.emit.mockResolvedValue(undefined);
    await adapter.emitEvent('pattern', { foo: 'bar' });
    expect(client.emit).toHaveBeenCalledWith('pattern', { foo: 'bar' });
  });

  it('should send event and return result', async () => {
    client.send.mockResolvedValue('ok');
    const result = await adapter.sendEvent('pattern', { foo: 'bar' });
    expect(client.send).toHaveBeenCalledWith('pattern', { foo: 'bar' });
    expect(result).toBe('ok');
  });
});
