import {
  AppointmentServiceProxy,
  AppointmentStatusServiceProxy,
  MyInvitationQrcodeDataDto,
  MyInvitationQrcodeServiceProxy,
} from "./../../shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import { Component, Injector, OnInit } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-my-invitation-qrcode-data",
  templateUrl: "./my-invitation-qrcode-data.component.html",
  animations: [appModuleAnimation()],
})
export class MyInvitationQrcodeDataComponent
  extends AppComponentBase
  implements OnInit {
  invitationData = new MyInvitationQrcodeDataDto();
  saving = false;
  appointmentId = 0;

  attendanceStatus = [
    // { id: "Scheduled", name: "Scheduled" },
    // { id: "Arrived", name: "Arrived" },
    // { id: "Completed", name: "Completed" },
    // { id: "Did not arrived", name: "Did not arrived" },
    // { id: "Cancelled", name: "Cancelled" },
  ];

  constructor(
    injector: Injector,

    private _myInvitationQrcodeService: MyInvitationQrcodeServiceProxy,
    private _appointmentService: AppointmentServiceProxy,
    private _appointmentStatusService: AppointmentStatusServiceProxy
  ) {
    super(injector);

    let id = window.location.href;
    id = id.substring(id.lastIndexOf("/") + 1, id.length);
    this.appointmentId = parseInt(id);

    this._appointmentStatusService.getAppointmentStatuses().subscribe((res) => {
      this.attendanceStatus = res;
    });
  }

  ngOnInit() {
    this._myInvitationQrcodeService
      .getMyInvitationQrCodeData(this.appointmentId)
      .subscribe(
        (res) => {
          this.invitationData = res;
        },
        (error) => {
          abp.message.warn(
            "Record not found of this appointment...!",
            "Record Not Found"
          );
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
}
