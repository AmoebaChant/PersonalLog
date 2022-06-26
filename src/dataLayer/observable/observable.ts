export interface ISubscribeOptions {
  notifyWithCurrentValue: boolean;
}

export interface IObservable<T> {
  subscribe(callback: (newValue: T) => void, options: ISubscribeOptions): () => void;
  value: T;
}

export class Observable<T> implements IObservable<T> {
  private _observers = new Array<(newValue: T) => void>();
  private _currentValue: T;

  public get value(): T {
    return this._currentValue;
  }

  public set value(newValue: T) {
    if (newValue !== this._currentValue) {
      this._currentValue = newValue;
      this.notify(newValue);
    }
  }

  constructor(startingValue: T) {
    this._currentValue = startingValue;
  }

  public subscribe(callback: (newValue: T) => void, options: ISubscribeOptions): () => void {
    this._observers.push(callback);
    if (options.notifyWithCurrentValue) {
      callback(this._currentValue);
    }
    return this.internalRemove.bind(this, callback);
  }

  private notify(newValue: T): void {
    for (const observer of this._observers) {
      observer(newValue);
    }
  }

  private internalRemove(callback: (newValue: T) => void): boolean {
    const index = this._observers.indexOf(callback);

    if (index !== -1) {
      this._observers.splice(index, 1);
      return true;
    }

    return false;
  }
}
