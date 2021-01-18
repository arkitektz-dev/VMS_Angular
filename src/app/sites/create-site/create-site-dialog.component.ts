import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AppComponentBase } from "@shared/app-component-base";
import {
  SiteServiceProxy,
  SiteDto,
  CreateSiteDto,
} from "@shared/service-proxies/service-proxies";
import { forEach as _forEach, map as _map } from "lodash-es";

@Component({
  templateUrl: "create-site-dialog.component.html",
})
export class CreateSiteDialogComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;
  site = new SiteDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _siteService: SiteServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {}

  save(): void {
    this.saving = true;

    const site = new CreateSiteDto();
    site.init(this.site);

    this._siteService
      .create(site)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }
}
