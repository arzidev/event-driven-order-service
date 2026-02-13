export class CreateOrderDto {
  orderId?: number;
  userId: number;
  status: string;
  totalAmount: number;
}
