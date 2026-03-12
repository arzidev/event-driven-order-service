import { OrderItem } from './order-item.entity';

describe('OrderItem', () => {
  it('should calculate subtotal as quantity * price', () => {
    const item = new OrderItem({
      id: 'item-1',
      orderId: 'order-1',
      productId: 'product-1',
      quantity: 3,
      price: 25,
    });

    expect(item.subtotal).toBe(75);
  });

  it('should expose orderId productId quantity and price', () => {
    const item = new OrderItem({
      id: 'item-2',
      orderId: 'order-2',
      productId: 'product-2',
      quantity: 2,
      price: 50,
    });

    expect(item.orderId).toBe('order-2');
    expect(item.productId).toBe('product-2');
    expect(item.Quantity).toBe(2);
    expect(item.Price).toBe(50);
  });
});
