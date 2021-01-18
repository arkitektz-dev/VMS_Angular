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
  VisitorServiceProxy,
  GetVisitorForEditOutput,
  VisitorDto,
  VisitorEditDto,
} from "@shared/service-proxies/service-proxies";

@Component({
  templateUrl: "edit-visitor-dialog.component.html",
})
export class EditVisitorDialogComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;
  id: number;
  visitor = new VisitorEditDto();
  sites = [];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _visitorService: VisitorServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
    //this.getAllSites();
  }

  ngOnInit(): void {
    this._visitorService
      .getVisitorForEdit(this.id)
      .subscribe((result: GetVisitorForEditOutput) => {
        this.visitor = result.visitor;
      });
  }

  save(): void {
    this.saving = true;

    const visitor = new VisitorDto();
    visitor.init(this.visitor);

    this._visitorService
      .update(visitor)
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
