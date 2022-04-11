export class Observable<T> {
  private _value: T;
  private nextSubscriptionKey: number = 0;
  private subscriptions: Map<number, (newValue: T) => void> = new Map<number, (newValue: T) => void>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  public get value(): T {
    return this._value;
  }
  public set value(newValue: T) {
    this._value = newValue;
    this.subscriptions.forEach((value: (newValue: T) => void) => {
      value(newValue);
    });
  }

  public subscribe = (callback: (newValue: T) => void): (() => void) => {
    const subscriptionId = this.nextSubscriptionKey++;
    this.subscriptions.set(subscriptionId, callback);
    return () => {
      this.subscriptions.delete(subscriptionId);
    };
  };
}
