import { EditAppointmentStatusComponent } from "./edit-appointment-status/edit-appointment-status.component";
import { CreateAppointmentStatusComponent } from "./create-appointment-status/create-appointment-status.component";
import { Component, Injector, OnInit } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  AppointmentStatusServiceProxy,
  AppointmentStatusesDto,
  AppointmentStatusesDtoPagedResultDto,
} from "@shared/service-proxies/service-proxies";

import { EventEmitterService } from "@app/services/event-emitter.service";
import { request } from "http";

class PagedAppointmentStatusesRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: "app-appointment-statuses",
  templateUrl: "./appointment-statuses.component.html",
  animations: [appModuleAnimation()],
})
export class AppointmentStatusesComponent extends PagedListingComponentBase<AppointmentStatusesDto> {
  appointmentStatus: AppointmentStatusesDto[] = [];
  keyword = "";
  saving = false;

  constructor(
    injector: Injector,
    private _appointmentStatusService: AppointmentStatusServiceProxy,
    private _modalService: BsModalService,
    private _eventEmitterService: EventEmitterService
  ) {
    super(injector);
  }

  protected list(
    request: PagedAppointmentStatusesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._appointmentStatusService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: AppointmentStatusesDtoPagedResultDto) => {
        this.appointmentStatus = result.items;

        this.showPaging(result, pageNumber);
      });
  }

  createStatus(): void {
    this.showCreateOrEditAppointmentStatusDialog();
  }

  editStatus(appointmentStatus): void {
    this.showCreateOrEditAppointmentStatusDialog(appointmentStatus.id);
  }

  showCreateOrEditAppointmentStatusDialog(id?: number): void {
    let createOrEditAppointmentStatusDialog: BsModalRef;
    if (!id) {
      createOrEditAppointmentStatusDialog = this._modalService.show(
        CreateAppointmentStatusComponent,
        {
          class: "modal-lg",
        }
      );
    } else {
      createOrEditAppointmentStatusDialog = this._modalService.show(
        EditAppointmentStatusComponent,
        {
          class: "modal-lg",
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditAppointmentStatusDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  protected delete(appointmentStatus: AppointmentStatusesDto): void {
    abp.message.confirm(
      this.l("AppointmentDeleteWarningMessage", ""),
      undefined,
      (result: boolean) => {
        if (result) {
          this._appointmentStatusService
            .delete(appointmentStatus.id)
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
}
