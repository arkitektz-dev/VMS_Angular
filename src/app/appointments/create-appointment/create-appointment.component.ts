import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from "@angular/core";
import { concat, Observable, of, Subject } from "rxjs";

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  tap,
} from "rxjs/operators";

import { BsModalRef } from "ngx-bootstrap/modal";
import { AppComponentBase } from "@shared/app-component-base";
import {
  AppointmentServiceProxy,
  AppointmentDto,
  VisitorDto,
  CreateVisitorDto,
  VisitorListDto,
  VisitorServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { forEach as _forEach, map as _map } from "lodash-es";
import * as moment from "moment";

@Component({
  templateUrl: "create-appointment.component.html",
})
export class CreateAppointmentComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;

  minDate = new Date();
  visitor = new VisitorDto();

  isVisitorAdd = false;

  appointment = new AppointmentDto();

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

  ngOnInit(): void {
    this.loadVisitor();
    // Create the new date
  }

  AddVisitorShow() {
    this.isVisitorAdd = true;
  }
  CancelVisitorShow() {
    this.isVisitorAdd = false;
  }

  save(): void {
    this.saving = true;

    const appointment = new AppointmentDto();
    appointment.init(this.appointment);
    appointment.time.utcOffset(0, true).format();
    this._appointmentService
      .create(appointment)
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

  trackByFn(item: VisitorDto) {
    return item.id;
  }

  // trackByFnEmployee(item: UserDto) {
  //   return item.id;
  // }

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

  OnChangeVisitor(appointment) {
    this._visitorService
      .checkVisitorStatus(appointment.visitorId)
      .subscribe((res) => {
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

  saveVisitor(): void {
    const visitor = new CreateVisitorDto();
    visitor.init(this.visitor);
    //console.log(visitor);
    this._visitorService
      .create(visitor)
      .pipe(
        finalize(() => {
          //this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.isVisitorAdd = false;
        this.visitor = new VisitorDto();
        // this.bsModalRef.hide();
        // this.onSave.emit();
      });
  }
}
