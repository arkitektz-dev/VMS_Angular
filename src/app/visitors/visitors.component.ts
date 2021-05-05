import { Component, Injector } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  VisitorServiceProxy,
  VisitorDto,
  VisitorDtoPagedResultDto,
  RoleServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { CreateVisitorDialogComponent } from "./create-visitor/create-visitor-dialog.component";
import { EditVisitorDialogComponent } from "./edit-visitor/edit-visitor-dialog.component";

class PagedVisitorsRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  templateUrl: "./visitors.component.html",
  animations: [appModuleAnimation()],
})
export class VisitorsComponent extends PagedListingComponentBase<VisitorDto> {
  visitors: VisitorDto[] = [];
  keyword = "";
  sites = [];
  saving = false;
  pageActions = [];

  constructor(
    injector: Injector,
    private _rolesService: RoleServiceProxy,
    private _visitorsService: VisitorServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
    this.getAllSites();
  }

  permissionActionRequest() {
    this._rolesService
      .getPermissionActionsByPage("Pages.Visitors")
      .pipe(
        finalize(() => {
          // finishedCallback();
        })
      )
      .subscribe((result) => {
        console.log(result);
        if (result.length > 0) {
          this.pageActions = result;
        }
      });
  }

  checkPageAction(pageAction) {
    return this.pageActions.includes(pageAction);
  }

  list(
    request: PagedVisitorsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    this.permissionActionRequest();

    this._visitorsService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: VisitorDtoPagedResultDto) => {
        this.visitors = result.items;

        this.showPaging(result, pageNumber);
      });
  }
  protected delete(visitor: VisitorDto): void {
    abp.message.confirm(
      this.l(
        "VisitorDeleteWarningMessage",
        visitor.firstName + " " + visitor.lastName
      ),
      undefined,
      (result: boolean) => {
        if (result) {
          this._visitorsService
            .delete(visitor.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l("SuccessfullyDeleted"));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  createVisitor(): void {
    this.showCreateOrEditVisitorDialog();
  }

  editVisitor(visitor: VisitorDto): void {
    this.showCreateOrEditVisitorDialog(visitor.id);
  }
  showCreateOrEditVisitorDialog(id?: number): void {
    let createOrEditVisitorDialog: BsModalRef;
    if (!id) {
      createOrEditVisitorDialog = this._modalService.show(
        CreateVisitorDialogComponent,
        {
          class: "modal-lg",
        }
      );
    } else {
      createOrEditVisitorDialog = this._modalService.show(
        EditVisitorDialogComponent,
        {
          class: "modal-lg",
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditVisitorDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  getAllSites() {
    this._visitorsService.getSites().subscribe((result) => {
      this.sites = result.items;
      console.log(this.sites);
    });
  }

  onChangeVisitorStatus(visitor) {
    this.saving = true;

    this._visitorsService
      .updateVisitorStatus(visitor)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("Update Successfully"));
      });
  }
}
