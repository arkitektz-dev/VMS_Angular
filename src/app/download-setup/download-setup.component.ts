import { Component, Injector, ChangeDetectionStrategy } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { ConfigurationServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { saveAs as importedSaveAs } from "file-saver";

@Component({
  templateUrl: "./download-setup.component.html",
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadSetupComponent extends AppComponentBase {
  constructor(
    injector: Injector,
    private _configurationsService: ConfigurationServiceProxy
  ) {
    super(injector);
  }
  observable: Observable<number>;

  public requestShow$ = new Subject<boolean>();
  public downloadShow$ = new Subject<boolean>();
  public waitContainer$ = new Subject<boolean>();

  ngOnInit(): void {
    this.requestShow$.next(false);
    this.downloadShow$.next(false);
    this.waitContainer$.next(false);

    this._configurationsService
    .checkSetupStatus("tenant1")
    .pipe(finalize(() => {}))
    .subscribe((result) => {
      if(result[0] === false && result[1] ===true) {
        this.requestShow$.next(false);
        this.waitContainer$.next(true);
        this.downloadShow$.next(false);
      }
      else if(result[0] === true && result[1] === true) {
        this.requestShow$.next(false);
        this.waitContainer$.next(false);
        this.downloadShow$.next(true);
      }
      else if(result[0] === false && result[1] === false) {
        this.requestShow$.next(true);
        this.waitContainer$.next(false);
        this.downloadShow$.next(false);
      }
    });

  }

  
  downloadSetup(): void {
    this._configurationsService
      .getSetup("tenant1")
      .pipe(finalize(() => {}))
      .subscribe((result) => {  
        if(result.length) {
          const byteString = window.atob(result);
          const arrayBuffer = new ArrayBuffer(byteString.length) ; 
          const int8Array= new Uint8Array(arrayBuffer);
          for (let i = 0; i < byteString.length; i++) {
             int8Array[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([int8Array], {type: "application/msi"});
          importedSaveAs(blob, 'Probe Application Setup.msi')
        }
        this.notify.info(this.l("Request Submitted Successfully"));
      });
  }

  requestSetup(): void {
    this._configurationsService
      .createSetup("tenant1")
      .pipe(finalize(() => {}))
      .subscribe((result: boolean) => {
        this.requestShow$.next(false);
        this.waitContainer$.next(true);
        this.downloadShow$.next(false);
        // this.notify.info(this.l("Request Submitted Successfully"));
      });
  }
}
