import { VisitorServiceProxy } from "./../../../shared/service-proxies/service-proxies";
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
import { concat, Observable, of, Subject } from "rxjs";

import {
  catchError,
  distinctUntilChanged,
  finalize,
  switchMap,
  tap,
} from "rxjs/operators";

@Component({
  selector: "app-edit-appointment",
  templateUrl: "./edit-appointment.component.html",
})
export class EditAppointmentComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;

  appointment = new AppointmentEditDto();
  id: number;
  appointmentDateVal: Date;
  appointmentTimeVal: Date;

  visitors$: Observable<VisitorListDto[]>;
  visitorLoading = false;
  visitorInput$ = new Subject<string>();

  employee$ = [];

  selectedPersons: VisitorListDto[] = <any>[];
  @Output() onSave = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _appointmentService: AppointmentServiceProxy,
    private _visitorService: VisitorServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loadVisitor();

    this._appointmentService
      .getAppointmentForEdit(this.id)
      .subscribe((result: GetAppointmentForEditOutput) => {
        this.appointment = result.appointment;
        let date = new Date(this.appointment.date.toISOString());
        this.appointmentDateVal = date;
        let time = new Date(this.appointment.time.toISOString());
        this.appointmentTimeVal = time;
        this.OnChangeVisitor(this.appointment, "onInit");
      });
  }

  trackByFn(item: VisitorDto) {
    return item.id;
  }

  compareWith(item, selected) {
    return item.id === selected.id;
  }

  private loadVisitor() {
    this.visitors$ = concat(
      of([]), // default items
      this.visitorInput$.pipe(
        distinctUntilChanged(),
        tap(() => (this.visitorLoading = true)),
        switchMap((term) =>
          this._appointmentService.getVisitorsForSelect(term).pipe(
            //success(() => { console.log("inside service"); } ),
            catchError(() => of([])), // empty list on error
            tap(() => {
              this.visitorLoading = false;
            })
          )
        )
      )
    );
  }

  OnChangeVisitor(appointment, callFrom) {
    let visitorId =
      callFrom == "onInit" ? appointment.visitor.id : appointment.visitor;
    this._visitorService.checkVisitorStatus(visitorId).subscribe((res) => {
      if (res == true) {
        this.notify.error("This visitor is blacklisted...!", "", {
          timeOut: 3000,
        });
      }
    });

    this._appointmentService
      .getUsersForSelect(this.appointment.visitorId)
      .subscribe((result) => {
        this.employee$ = result;
      });
  }

  save(): void {
    this.saving = true;

    const appointment = new AppointmentDto();
    appointment.init(this.appointment);

    let mom = moment(this.appointmentTimeVal);
    appointment.time = mom;

    appointment.time.utcOffset(0, true).format();

    this._appointmentService
      .update(appointment)
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
