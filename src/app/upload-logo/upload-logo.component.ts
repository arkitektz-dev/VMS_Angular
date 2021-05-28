import {
  Component,
  Injector,
  OnInit,
  ChangeDetectionStrategy,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  TenantServiceProxy,
  RoleServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";
import { IAjaxResponse } from "@node_modules/abp-ng2-module";

@Component({
  templateUrl: "./upload-logo.component.html",
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadLogoComponent extends AppComponentBase implements OnInit {
  public uploader: FileUploader;
  private _uploaderOptions: FileUploaderOptions = {};
  pageActions = [];

  constructor(
    injector: Injector,
    private _rolesService: RoleServiceProxy,
    private _tenantServiceProxy: TenantServiceProxy
  ) {
    super(injector);
  }

  permissionActionRequest() {
    this._rolesService
      .getPermissionActionsByPage("Pages.UploadLogo")
      .pipe(
        finalize(() => {
          // finishedCallback();
        })
      )
      .subscribe((result) => {
        if (result.length > 0) {
          this.pageActions = result;
        }
      });
  }

  checkPageAction(pageAction) {
    return this.pageActions.includes(pageAction);
  }

  ngOnInit() {
    this.initFileUploader();
  }

  initFileUploader(): void {
    this.uploader = new FileUploader({
      url: "http://localhost:21021" + "/FileUpload/UploadFile",
    });

    this._uploaderOptions.autoUpload = false;
    this._uploaderOptions.removeAfterUpload = true;
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status) => {
      const resp = <IAjaxResponse>JSON.parse(response);
      if (resp.success) {
        this._tenantServiceProxy
          .uploadLogo(resp.result)
          .pipe(finalize(() => {}))
          .subscribe(() => {});

        abp.notify.success(this.l("FileSavedSuccessfully"));

        location.reload();
      } else {
        abp.notify.error(this.l("SomeErrorOccured"));
      }
    };

    this.uploader.setOptions(this._uploaderOptions);
  }

  save(): void {
    this.uploader.uploadAll();
  }

  fileChangeEvent(event: any): void {
    this.uploader.clearQueue();
    this.uploader.addToQueue([event.target.files[0]]);
  }
}
