import { Component, Injector } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  SiteServiceProxy,
  SiteDto,
  SiteDtoPagedResultDto,
} from "@shared/service-proxies/service-proxies";
import { CreateSiteDialogComponent } from "./create-site/create-site-dialog.component";
import { EditSiteDialogComponent } from "./edit-site/edit-site-dialog.component";

class PagedSitesRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  templateUrl: "./sites.component.html",
  animations: [appModuleAnimation()],
})
export class SitesComponent extends PagedListingComponentBase<SiteDto> {
  sites: SiteDto[] = [];
  keyword = "";

  constructor(
    injector: Injector,
    private _sitesService: SiteServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  list(
    request: PagedSitesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._sitesService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: SiteDtoPagedResultDto) => {
        this.sites = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(site: SiteDto): void {
    abp.message.confirm(
      this.l("SiteDeleteWarningMessage", site.siteName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._sitesService
            .delete(site.id)
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

  createSite(): void {
    this.showCreateOrEditSiteDialog();
  }

  editSite(site: SiteDto): void {
    this.showCreateOrEditSiteDialog(site.id);
  }

  showCreateOrEditSiteDialog(id?: number): void {
    let createOrEditSiteDialog: BsModalRef;
    if (!id) {
      createOrEditSiteDialog = this._modalService.show(
        CreateSiteDialogComponent,
        {
          class: "modal-lg",
        }
      );
    } else {
      createOrEditSiteDialog = this._modalService.show(
        EditSiteDialogComponent,
        {
          class: "modal-lg",
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditSiteDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}
