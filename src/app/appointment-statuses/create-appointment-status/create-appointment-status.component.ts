import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AppComponentBase } from "@shared/app-component-base";
import {
  AppointmentStatusServiceProxy,
  AppointmentStatusesDto,
  CreateAppointmentStatusesDto,
} from "@shared/service-proxies/service-proxies";
import { forEach as _forEach, map as _map } from "lodash-es";

@Component({
  selector: "app-create-appointment-status",
  templateUrl: "./create-appointment-status.component.html",
})
export class CreateAppointmentStatusComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;
  status = new AppointmentStatusesDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _appointemtStatusService: AppointmentStatusServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit() {}

  save(): void {
    this.saving = true;

    const status = new CreateAppointmentStatusesDto();
    status.init(this.status);

    this._appointemtStatusService
      .create(status)
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
