export class OrderCreatedEvent {
  constructor(
    public readonly orderId: number,
    public readonly userId: number,
    public readonly status: string,
    public readonly totalAmount: number,
  ) {}
}
