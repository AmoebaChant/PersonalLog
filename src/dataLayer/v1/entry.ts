import { IObservable, Observable } from '../observable/observable';
import { ITag, IV1Entry } from './schema';

export class V1Entry implements IV1Entry {
  public readonly tags: IObservable<ITag[]> = new Observable<ITag[]>([]);
  public readonly date: IObservable<string> = new Observable<string>('');
  public readonly body: IObservable<string> = new Observable<string>('');
  public readonly unsubscribers: (() => void)[] = [];

  constructor(public readonly id: string, tags: ITag[], date: string, body: string) {
    this.tags.value = tags;
    this.date.value = date;
    this.body.value = body;
  }
}
