import { EventEmitter, Injectable } from "@angular/core";
import { Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EventEmitterService {
  onChangeSiteIdFunction = new EventEmitter();
  subsVar: Subscription;
  invSubsVar: Subscription;

  constructor() {}

  onChangeOfSiteId() {
    this.onChangeSiteIdFunction.emit();
  }
}
