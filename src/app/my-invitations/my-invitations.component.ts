import {
  AppointmentStatusServiceProxy,
  MyInvitationDto,
  MyInvitationDtoPagedResultDto,
  MyInvitationServiceProxy,
  RoleServiceProxy,
} from "./../../shared/service-proxies/service-proxies";
import { Component, Injector, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";

import { CreateInvitationComponent } from "./create-invitation/create-invitation.component";
import { EditInvitationComponent } from "./edit-invitation/edit-invitation.component";
import { EventEmitterService } from "@app/services/event-emitter.service";
import { DetailInvitationComponent } from "./detail-invitation/detail-invitation.component";
import * as moment from "moment";

class PagedMyInvitationRequestDto extends PagedRequestDto {
  keyword: string;
  fromDate: moment.Moment;
  toDate: moment.Moment;
}

@Component({
  selector: "app-my-invitations",
  templateUrl: "./my-invitations.component.html",
  animations: [appModuleAnimation()],
})
export class MyInvitationsComponent extends PagedListingComponentBase<MyInvitationDto> {
  appointments: MyInvitationDto[] = [];
  keyword = "";
  saving = false;

  fromDate = undefined;
  toDate = undefined;

  minToDate = new Date();

  advancedFiltersVisible = false;

  attendanceStatus = [
    // { id: "Scheduled", name: "Scheduled" },
    // { id: "Cancelled", name: "Cancelled" },
  ];
  pageActions = [];

  constructor(
    injector: Injector,
    private _rolesService: RoleServiceProxy,
    private _myInvitationService: MyInvitationServiceProxy,
    private _modalService: BsModalService,
    private _eventEmitterService: EventEmitterService,
    private _appointmentStatusService: AppointmentStatusServiceProxy
  ) {
    super(injector);
    this._appointmentStatusService.getAppointmentStatuses().subscribe((res) => {
      this.attendanceStatus = res.filter(
        (x) => x.status == "Scheduled" || x.status == "Cancelled"
      );
    });
  }

  permissionActionRequest() {
    this._rolesService
      .getPermissionActionsByPage("Pages.MyInvitations")
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

  protected list(
    request: PagedMyInvitationRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.fromDate = this.fromDate;
    request.toDate = this.toDate;
    this.permissionActionRequest();

    this._myInvitationService
      .getAll(
        request.keyword,
        request.fromDate,
        request.toDate,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: MyInvitationDtoPagedResultDto) => {
        this.appointments = result.items;

        if (this._eventEmitterService.invSubsVar === undefined) {
          this._eventEmitterService.invSubsVar = this._eventEmitterService.onChangeSiteIdFunction.subscribe(
            () => {
              this.RefreshDataTable();
            }
          );
        }

        this.showPaging(result, pageNumber);
      });
  }

  onFromDateChange(value) {
    this.minToDate = value;
  }

  clearFilters(): void {
    this.keyword = "";
    this.fromDate = undefined;
    this.toDate = undefined;
    this.getDataPage(1);
  }

  protected delete(myInvitation: MyInvitationDto): void {
    abp.message.confirm(
      this.l("InvitationDeleteWarningMessage", ""),
      undefined,
      (result: boolean) => {
        if (result) {
          this._myInvitationService
            .delete(myInvitation.id)
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

  createInvitation(): void {
    this.showCreateOrEditInvitationDialog();
  }

  editInvitation(invitation): void {
    this.showCreateOrEditInvitationDialog(invitation.id);
  }
  showCreateOrEditInvitationDialog(id?: number): void {
    let createOrEditInvitationDialog: BsModalRef;
    if (!id) {
      createOrEditInvitationDialog = this._modalService.show(
        CreateInvitationComponent,
        {
          class: "modal-lg",
        }
      );
    } else {
      createOrEditInvitationDialog = this._modalService.show(
        EditInvitationComponent,
        {
          class: "modal-lg",
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditInvitationDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  onChangeAttendanceStatus(myInvitation) {
    this.saving = true;

    this._myInvitationService
      .updateAttendanceStatus(myInvitation)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("Update Successfully"));
      });
  }

  onVisitorClick(appointment) {
    let detailAppointmentDialog: BsModalRef;
    if (appointment.id) {
      detailAppointmentDialog = this._modalService.show(
        DetailInvitationComponent,
        {
          class: "modal-lg",
          initialState: {
            appointment: appointment,
          },
        }
      );
    }
  }

  RefreshDataTable() {
    this.refresh();
  }
}
