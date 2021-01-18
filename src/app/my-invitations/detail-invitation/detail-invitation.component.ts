import { MyInvitationDto } from "./../../../shared/service-proxies/service-proxies";
import { VisitorServiceProxy } from "../../../shared/service-proxies/service-proxies";
import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  AppointmentServiceProxy,
  AppointmentDto,
  VisitorDto,
  VisitorListDto,
  AppointmentEditDto,
  GetAppointmentForEditOutput,
} from "@shared/service-proxies/service-proxies";
import * as moment from "moment";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-detail-invitation",
  templateUrl: "./detail-invitation.component.html",
})
export class DetailInvitationComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;

  //appointment = new AppointmentEditDto();
  appointment: MyInvitationDto;
  appointmentDateVal: Date;
  appointmentTimeVal: Date;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _appointmentService: AppointmentServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit() {}
}
