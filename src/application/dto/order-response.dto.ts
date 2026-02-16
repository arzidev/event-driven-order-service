export class OrderResponseDto {
  id: string;
  customerId: string;
  status: string;
  total: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  createdAt: Date;
}
