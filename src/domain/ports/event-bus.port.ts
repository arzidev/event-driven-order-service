export interface EventBusPort {
  emitEvent(pattern: string, payload: any): Promise<void>;
  sendEvent(pattern: string, payload: any): Promise<any>;
}
