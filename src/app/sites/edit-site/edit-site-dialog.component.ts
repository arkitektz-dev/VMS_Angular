import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import {
  forEach as _forEach,
  includes as _includes,
  map as _map,
} from "lodash-es";
import { AppComponentBase } from "@shared/app-component-base";
import {
  SiteServiceProxy,
  GetSiteForEditOutput,
  SiteDto,
  SiteEditDto,
} from "@shared/service-proxies/service-proxies";

@Component({
  templateUrl: "edit-site-dialog.component.html",
})
export class EditSiteDialogComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;
  id: number;
  site = new SiteEditDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _siteService: SiteServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._siteService
      .getSiteForEdit(this.id)
      .subscribe((result: GetSiteForEditOutput) => {
        this.site = result.site;
      });
  }

  save(): void {
    this.saving = true;

    const site = new SiteDto();
    site.init(this.site);

    this._siteService
      .update(site)
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
