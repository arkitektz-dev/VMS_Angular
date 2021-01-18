import { DetailAppointmentComponent } from "./detail-appointment/detail-appointment.component";
import { AppointmentStatusServiceProxy } from "./../../shared/service-proxies/service-proxies";
import { Component, Injector, OnInit } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  AppointmentServiceProxy,
  AppointmentDto,
  AppointmentDtoPagedResultDto,
} from "@shared/service-proxies/service-proxies";
import { CreateAppointmentComponent } from "./create-appointment/create-appointment.component";
import { EditAppointmentComponent } from "./edit-appointment/edit-appointment.component";
import { EventEmitterService } from "@app/services/event-emitter.service";
import { request } from "http";
import * as moment from "moment";

class PagedAppointmentRequestDto extends PagedRequestDto {
  keyword: string;
  fromDate: moment.Moment;
  toDate: moment.Moment;
}

@Component({
  selector: "app-appointments",
  templateUrl: "./appointments.component.html",
  animations: [appModuleAnimation()],
})
export class AppointmentsComponent extends PagedListingComponentBase<AppointmentDto> {
  appointments: AppointmentDto[] = [];
  keyword = "";
  saving = false;
  fromDate = undefined;
  toDate = undefined;

  minToDate = new Date();

  advancedFiltersVisible = false;
  attendanceStatus = [
    // { id: "Scheduled", name: "Scheduled" },
    // { id: "Arrived", name: "Arrived" },
    // { id: "Completed", name: "Completed" },
    // { id: "Did not arrived", name: "Did not arrived" },
    // { id: "Cancelled", name: "Cancelled" },
  ];

  constructor(
    injector: Injector,
    private _appointmentService: AppointmentServiceProxy,
    private _modalService: BsModalService,
    private _eventEmitterService: EventEmitterService,
    private _appointmentStatusService: AppointmentStatusServiceProxy
  ) {
    super(injector);
    this._appointmentStatusService.getAppointmentStatuses().subscribe((res) => {
      this.attendanceStatus = res;
    });
  }

  protected list(
    request: PagedAppointmentRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.fromDate = this.fromDate;
    request.toDate = this.toDate;
    this._appointmentService
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
      .subscribe((result: AppointmentDtoPagedResultDto) => {
        this.appointments = result.items;

        if (this._eventEmitterService.subsVar === undefined) {
          this._eventEmitterService.subsVar = this._eventEmitterService.onChangeSiteIdFunction.subscribe(
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

  createAppointment(): void {
    this.showCreateOrEditAppointmentSiteDialog();
  }

  editAppointment(appointment): void {
    this.showCreateOrEditAppointmentSiteDialog(appointment.id);
    console.log(appointment.id);
  }

  showCreateOrEditAppointmentSiteDialog(id?: number): void {
    let createOrEditAppointmentDialog: BsModalRef;
    if (!id) {
      createOrEditAppointmentDialog = this._modalService.show(
        CreateAppointmentComponent,
        {
          class: "modal-lg",
        }
      );
    } else {
      createOrEditAppointmentDialog = this._modalService.show(
        EditAppointmentComponent,
        {
          class: "modal-lg",
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditAppointmentDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  protected delete(appointment: AppointmentDto): void {
    abp.message.confirm(
      this.l("AppointmentDeleteWarningMessage", ""),
      undefined,
      (result: boolean) => {
        if (result) {
          this._appointmentService
            .delete(appointment.id)
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

  onChangeAttendanceStatus(appointment) {
    this.saving = true;

    this._appointmentService
      .updateAttendanceStatus(appointment)
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
        DetailAppointmentComponent,
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
