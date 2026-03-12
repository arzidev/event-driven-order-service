import { OrdersController } from './orders-events.controller';

describe('OrdersEventsController', () => {
  it('should log event on handleOrderCreated', () => {
    const controller = new OrdersController();
    const spy = jest.spyOn(console, 'log').mockImplementation();
    controller.handleOrderCreated({ foo: 'bar' });
    expect(spy).toHaveBeenCalledWith('llega el evento', { foo: 'bar' });
    spy.mockRestore();
  });
});
