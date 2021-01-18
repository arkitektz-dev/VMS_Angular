import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import {
  forEach as _forEach,
  includes as _includes,
  map as _map,
} from "lodash-es";
import { AppComponentBase } from "@shared/app-component-base";
import {
  AppointmentStatusServiceProxy,
  GetAppointmentStatusesForEditOutput,
  AppointmentStatusesDto,
  AppointmentStatusesEditDto,
} from "@shared/service-proxies/service-proxies";

@Component({
  selector: "app-edit-appointment-status",
  templateUrl: "./edit-appointment-status.component.html",
})
export class EditAppointmentStatusComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;
  id: number;
  status = new AppointmentStatusesEditDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _appointemtStatusService: AppointmentStatusServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._appointemtStatusService
      .getAppointmentStatusForEdit(this.id)
      .subscribe((result: GetAppointmentStatusesForEditOutput) => {
        this.status = result.appointmentStatuses;
      });
  }

  save(): void {
    this.saving = true;

    const status = new AppointmentStatusesDto();
    status.init(this.status);

    this._appointemtStatusService
      .update(status)
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
