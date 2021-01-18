import { SitesListDto } from "./../../../shared/service-proxies/service-proxies";
import {
  AssignedSitesServiceProxy,
  AssignedSitesEditDto,
  GetAssignedSitesForEditOutput,
} from "@shared/service-proxies/service-proxies";
import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import {
  forEach as _forEach,
  includes as _includes,
  map as _map,
} from "lodash-es";
import { AppComponentBase } from "@shared/app-component-base";
import { Observable } from "rxjs";

@Component({
  templateUrl: "edit-assigned-site.component.html",
})
export class EditAssignedSiteDialogComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;
  id: number;
  assignedSite = new AssignedSitesEditDto();
  items = [];
  selectedSites = [];
  sitesListObject: SitesListDto[];
  //sitesDropdown = new FormControl();
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _assignedSiteService: AssignedSitesServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getAllSites();

    this.getAssignedSites();
  }

  getAssignedSites() {
    this._assignedSiteService
      .getAssignedSiteNewForEdit(this.id)
      .subscribe((result: GetAssignedSitesForEditOutput) => {
        this.assignedSite = result.assignedSite;
        console.log(result);
        this.selectedSites = this.assignedSite.assignedSitesId;
      });
  }

  getAllSites() {
    this._assignedSiteService.getSites().subscribe((result) => {
      this.items = result.items;
      console.log(this.items);
    });
  }

  getValues() {
    this.selectedSites = this.selectedSites;
    console.log(this.selectedSites);
    // this.sitesListObject = this.items.filter((x) =>
    //   this.selectedSites.includes(x.id)
    // );
    // console.log(this.sitesListObject);
  }

  save(): void {
    this.saving = true;

    //const assignedSite = new AssignedSitesDto();
    //assignedSite.init(this.assignedSite);

    this._assignedSiteService
      .insertNewSites(this.assignedSite.userId, this.selectedSites)
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
