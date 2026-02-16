interface OrderItemProps {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export class OrderItem {
  public readonly id: string;
  private _orderId: string;
  private readonly _productId: string;
  public quantity: number;
  public price: number;

  constructor(props: OrderItemProps) {
    this.id = props.id;
    this._orderId = props.orderId;
    this._productId = props.productId;
    this.quantity = props.quantity;
    this.price = props.price;
  }

  get subtotal(): number {
    return this.quantity * this.price;
  }

  get orderId(): string {
    return this._orderId;
  }

  get productId(): string {
    return this._productId;
  }

  get Quantity(): number {
    return this.quantity;
  }

  get Price(): number {
    return this.price;
  }
}
