import { SiteDto } from "./../../../shared/service-proxies/service-proxies";
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
  VisitorServiceProxy,
  VisitorDto,
  CreateVisitorDto,
} from "@shared/service-proxies/service-proxies";
import { forEach as _forEach, map as _map } from "lodash-es";
import { Observable } from "rxjs";

@Component({
  templateUrl: "create-visitor-dialog.component.html",
})
export class CreateVisitorDialogComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;
  visitor = new VisitorDto();
  sites = [];
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _visitorService: VisitorServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    //this.getAllSites();
  }

  save(): void {
    this.saving = true;

    const visitor = new CreateVisitorDto();
    visitor.init(this.visitor);
    //console.log(visitor);
    this._visitorService
      .create(visitor)
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

  // getAllSites() {
  //   this._visitorService.getSites().subscribe((result) => {
  //     this.sites = result.items;
  //     //console.log(this.items);
  //   });
  // }
}
