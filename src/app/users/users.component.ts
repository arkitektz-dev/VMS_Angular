import { AbpSessionService } from "abp-ng2-module";
import { Component, Injector } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "shared/paged-listing-component-base";
import {
  UserServiceProxy,
  UserDto,
  UserDtoPagedResultDto,
  RoleServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { CreateUserDialogComponent } from "./create-user/create-user-dialog.component";
import { EditUserDialogComponent } from "./edit-user/edit-user-dialog.component";
import { ResetPasswordDialogComponent } from "./reset-password/reset-password.component";

class PagedUsersRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  templateUrl: "./users.component.html",
  animations: [appModuleAnimation()],
})
export class UsersComponent extends PagedListingComponentBase<UserDto> {
  users: UserDto[] = [];
  keyword = "";
  isActive: boolean | null;
  advancedFiltersVisible = false;
  pageTitle = null;
  pageActions = [];

  constructor(
    injector: Injector,
    private _rolesService: RoleServiceProxy,
    private _userService: UserServiceProxy,
    private _modalService: BsModalService,
    private _abpSessionService: AbpSessionService
  ) {
    super(injector);
    if (this._abpSessionService.tenantId != null) {
      this.pageTitle = "Employees";
    } else {
      this.pageTitle = "Users";
    }
  }

  permissionActionRequest() {
    this._rolesService
      .getPermissionActionsByPage("Pages.Users")
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

  createUser(): void {
    this.showCreateOrEditUserDialog();
  }

  editUser(user: UserDto): void {
    this.showCreateOrEditUserDialog(user.id);
  }

  public resetPassword(user: UserDto): void {
    this.showResetPasswordUserDialog(user.id);
  }

  clearFilters(): void {
    this.keyword = "";
    this.isActive = undefined;
    this.getDataPage(1);
  }

  protected list(
    request: PagedUsersRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;
    this.permissionActionRequest();

    this._userService
      .getAll(
        request.keyword,
        request.isActive,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: UserDtoPagedResultDto) => {
        this.users = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(user: UserDto): void {
    if (this._abpSessionService.tenantId == null) {
      abp.message.confirm(
        this.l("UserDeleteWarningMessage", user.fullName),
        undefined,
        (result: boolean) => {
          if (result) {
            this._userService.delete(user.id).subscribe(() => {
              abp.notify.success(this.l("SuccessfullyDeleted"));
              this.refresh();
            });
          }
        }
      );
    } else {
      abp.message.confirm(
        this.l("Employee " + user.fullName + " will be deleted."),
        undefined,
        (result: boolean) => {
          if (result) {
            this._userService.delete(user.id).subscribe(() => {
              abp.notify.success(this.l("SuccessfullyDeleted"));
              this.refresh();
            });
          }
        }
      );
    }
  }

  private showResetPasswordUserDialog(id?: number): void {
    this._modalService.show(ResetPasswordDialogComponent, {
      class: "modal-lg",
      initialState: {
        id: id,
      },
    });
  }

  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateUserDialogComponent,
        {
          class: "modal-lg",
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditUserDialogComponent,
        {
          class: "modal-lg",
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
}
