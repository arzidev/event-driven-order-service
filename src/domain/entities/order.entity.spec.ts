import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

const buildItem = (params: {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}) => new OrderItem(params);

describe('Order', () => {
  it('should calculate total from all items subtotals', () => {
    const order = new Order({
      id: 'order-1',
      customerId: 'customer-1',
      status: 'created',
      items: [
        buildItem({
          id: 'item-1',
          orderId: 'order-1',
          productId: 'product-1',
          quantity: 2,
          price: 50,
        }),
        buildItem({
          id: 'item-2',
          orderId: 'order-1',
          productId: 'product-2',
          quantity: 1,
          price: 100,
        }),
      ],
    });

    expect(order.total).toBe(200);
  });

  it('should use provided createdAt and updatedAt', () => {
    const createdAt = new Date('2026-02-19T00:00:00.000Z');
    const updatedAt = new Date('2026-02-19T01:00:00.000Z');

    const order = new Order({
      id: 'order-2',
      customerId: 'customer-2',
      status: 'created',
      items: [],
      createdAt,
      updatedAt,
    });

    expect(order.createdAt).toBe(createdAt);
    expect(order.updatedAt).toBe(updatedAt);
  });

  it('should create defensive copy in getItems', () => {
    const order = new Order({
      id: 'order-3',
      customerId: 'customer-3',
      status: 'created',
      items: [
        buildItem({
          id: 'item-1',
          orderId: 'order-3',
          productId: 'product-1',
          quantity: 1,
          price: 10,
        }),
      ],
    });

    const items = order.getItems();
    items.push(
      buildItem({
        id: 'item-2',
        orderId: 'order-3',
        productId: 'product-2',
        quantity: 1,
        price: 20,
      }),
    );

    expect(order.getItems()).toHaveLength(1);
  });
});
