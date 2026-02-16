import { Injectable } from '@nestjs/common';
import { Order } from 'src/domain/entities/order.entity';
import { IOrderRepository } from 'src/domain/repositories/order.repository';
import { PrismaService } from './prisma.service';
import { OrderItem } from 'src/domain/entities/order-item.entity';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}
  async create(order: Order): Promise<Order> {
    const created = await this.prisma.order.create({
      data: {
        id: order.id,
        customerId: order.customerId,
        status: order.status,
        total: order.total,
        items: {
          create: order.getItems().map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    const orderFromDb = new Order({
      id: created.id,
      customerId: created.customerId,
      status: created.status,
      items: created.items.map((item) => {
        return new OrderItem({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      }),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
    return orderFromDb;
  }

  async findById(id: string): Promise<Order | null> {
    const found = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!found) return null;

    return new Order({
      id: found.id,
      customerId: found.customerId,
      status: found.status,
      items: found.items.map((item) => {
        return new OrderItem({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      }),
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    });
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: { items: true },
    });

    return orders.map(
      (order) =>
        new Order({
          id: order.id,
          customerId: order.customerId,
          status: order.status,
          items: order.items.map((item) => {
            return new OrderItem({
              id: item.id,
              orderId: item.orderId,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            });
          }),
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }),
    );
  }

  async update(order: Order): Promise<Order> {
    return order;
  }

  async delete(id: string): Promise<void> {}
}
