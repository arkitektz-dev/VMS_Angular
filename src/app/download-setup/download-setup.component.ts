import { Component, Injector, ChangeDetectionStrategy } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { ConfigurationServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";

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

  public show: boolean = true;
  public helperText: string =
    "Please click this button to request for the probe application.";

  ngOnInit(): void {
    this._configurationsService
      .getSetupLink("tenant1")
      .pipe(finalize(() => {}))
      .subscribe((result) => {
        // let fileReader = new FileReader();
        // fileReader.onload = (e) => {
        //   console.log(fileReader.result);
        // }
        // window.URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
        // fileReader.readAsText(result);
        console.log(result);
      });
  }

  save(): void {
    this.show = false;
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
