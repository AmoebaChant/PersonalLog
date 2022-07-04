import { IObservable, IReadOnlyObservable, Observable } from '../observable/observable';
import { ITag, IV1Entry } from './schema';

export class V1Entry implements IV1Entry {
  private _allTags: Observable<ITag[]> = new Observable<ITag[]>([]);
  public readonly tags: IObservable<ITag[]> = new Observable<ITag[]>([]);
  public readonly bodyTags: IObservable<ITag[]> = new Observable<ITag[]>([]);
  public readonly date: IObservable<string> = new Observable<string>('');
  public readonly body: IObservable<string> = new Observable<string>('');
  public readonly unsubscribers: (() => void)[] = [];

  public get allTags(): IReadOnlyObservable<ITag[]> {
    return this._allTags;
  }

  constructor(public readonly id: string, tags: ITag[], bodyTags: ITag[], date: string, body: string) {
    this.date.value = date;
    this.body.value = body;
    this.tags.value = tags;
    this.bodyTags.value = bodyTags;

    this.updateAllTags();

    this.tags.subscribe(
      () => {
        this.updateAllTags();
      },
      { notifyWithCurrentValue: false }
    );
    this.bodyTags.subscribe(
      () => {
        this.updateAllTags();
      },
      { notifyWithCurrentValue: false }
    );
  }

  private updateAllTags(): void {
    const allTags: ITag[] = this.tags.value.slice().concat(this.bodyTags.value.slice());
    this._allTags.value = allTags;
  }
}
