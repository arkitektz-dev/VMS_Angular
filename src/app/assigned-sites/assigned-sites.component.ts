import { Component, Injector } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  AssignedSitesServiceProxy,
  AssignedSitesDto,
  AssignedSitesDtoPagedResultDto,
} from "@shared/service-proxies/service-proxies";
import { EditAssignedSiteDialogComponent } from "./edit-assigned-site/edit-assigned-site.component";

class PagedAssignedSitesRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: "app-assigned-sites",
  templateUrl: "./assigned-sites.component.html",
  animations: [appModuleAnimation()],
})
export class AssignedSitesComponent extends PagedListingComponentBase<AssignedSitesDto> {
  assignedSites: AssignedSitesDto[] = [];
  keyword = "";
  saving = false;
  constructor(
    injector: Injector,
    private _assignedSitesService: AssignedSitesServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  protected list(
    request: PagedAssignedSitesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._assignedSitesService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: AssignedSitesDtoPagedResultDto) => {
        this.assignedSites = result.items;
        console.log(this.assignedSites);
        this.showPaging(result, pageNumber);
      });
  }

  editAssignedSite(assigedSitesNewDto: AssignedSitesDto): void {
    console.log(assigedSitesNewDto);

    this.showCreateOrEditAssignedSiteDialog(assigedSitesNewDto.userId);
  }

  showCreateOrEditAssignedSiteDialog(id?: number): void {
    let createOrEditAssignedSiteDialog: BsModalRef;
    if (id) {
      createOrEditAssignedSiteDialog = this._modalService.show(
        EditAssignedSiteDialogComponent,
        {
          class: "modal-lg",
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditAssignedSiteDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  onChangeDefaultSite(event) {
    alert(event.target.value);
    this.saving = true;

    this._assignedSitesService
      .updateIsDefaultAssignedSite(event.target.value)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("Update Successfully"));
      });
  }
  protected delete(entity: AssignedSitesDto): void {
    throw new Error("Method not implemented.");
  }
}
