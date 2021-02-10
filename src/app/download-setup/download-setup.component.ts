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
  public downloadShow$ = new Subject<boolean>();
  public requestShow: boolean = true;
  public downloadShow: boolean = false;
  public helperText: string =
    "Please click this button to request for the probe application.";

  ngOnInit(): void {
    this.requestShow$.next(false);
    this.downloadShow$.next(false);

    this._configurationsService
      .checkSetupGenerated("tenant1")
      .pipe(finalize(() => {}))
      .subscribe((result) => {
        if (result) {
          this.requestShow$.next(false);
          this.downloadShow$.next(true);
        } else {
          this.requestShow$.next(true);
          this.downloadShow$.next(false);
        }
        // this.downloadShow = true;
        // console.log(result);
        // if (result) {
        //   this.downloadShow = true;
        // }
        // console.log(this.downloadShow);
        // const byteString = window.atob(result);
        // const arrayBuffer = new ArrayBuffer(byteString.length);
        // const int8Array = new Uint8Array(arrayBuffer);
        // for (let i = 0; i < byteString.length; i++) {
        //   int8Array[i] = byteString.charCodeAt(i);
        // }
        // const blob = new Blob([int8Array], { type: "application/msi" });
        // var a = new File([blob], "abc", { type: "application/msi" });
        // importedSaveAs(blob, "abcz.msi");
        // var url = window.URL.createObjectURL(a);
        // console.log(url);
        // return blob;
        // console.log(result);
        // var file = new Blob([result], { type: "application/msi" });
      });
  }

  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == "undefined") {
      alert("Please disable your Pop-up blocker and try again.");
    }
  }

  save(): void {
    this.requestShow$.next(false);

    this.helperText = "Please Wait...";
    this._configurationsService
      .createSetup("tenant1")
      .pipe(finalize(() => {}))
      .subscribe((result: boolean) => {
        if (result) {
          this.helperText = "Successfull";
        }
        this.notify.info(this.l("Request Submitted Successfully"));
      });
  }
}
