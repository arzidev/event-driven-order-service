import { OrderItem } from './order-item.entity';

interface OrderProps {
  id: string;
  customerId: string;
  status: string;
  items: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  public readonly id: string;
  private _customerId: string;
  private _status: string;
  private _items: OrderItem[];
  public readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: OrderProps) {
    this.id = props.id;
    this._customerId = props.customerId;
    this._status = props.status;
    this._items = props.items;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  getItems(): OrderItem[] {
    return [...this._items];
  }

  get customerId(): string {
    return this._customerId;
  }

  get status(): string {
    return this._status;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get total(): number {
    return this._items.reduce((sum, item) => sum + item.subtotal, 0);
  }
}
