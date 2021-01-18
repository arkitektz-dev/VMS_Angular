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
  MyInvitationServiceProxy,
  AppointmentDto,
  VisitorDto,
  UserDto,
  UserListDto,
  VisitorListDto,
  MyInvitationEditDto,
  GetMyInvitationForEditOutput,
} from "@shared/service-proxies/service-proxies";
import * as moment from "moment";
import { BsModalRef } from "ngx-bootstrap/modal";
import { concat, Observable, of, Subject } from "rxjs";

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  tap,
} from "rxjs/operators";

@Component({
  selector: "app-edit-invitation",
  templateUrl: "./edit-invitation.component.html",
})
export class EditInvitationComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;

  myInvitation = new MyInvitationEditDto();
  id: number;
  myInvitationDateVal: Date;
  myInvitationTimeVal: Date;

  visitors$: Observable<VisitorListDto[]>;
  visitorLoading = false;
  visitorInput$ = new Subject<string>();

  employee$ = [];

  selectedPersons: VisitorListDto[] = <any>[];
  @Output() onSave = new EventEmitter<any>();
  constructor(
    injector: Injector,
    private _myInvitationService: MyInvitationServiceProxy,
    private _visitorService: VisitorServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loadVisitor();

    this._myInvitationService
      .getMyInvitationForEdit(this.id)
      .subscribe((result: GetMyInvitationForEditOutput) => {
        this.myInvitation = result.myInvitation;
        let date = new Date(this.myInvitation.date.toISOString());
        this.myInvitationDateVal = date;
        let time = new Date(this.myInvitation.time.toISOString());
        this.myInvitationTimeVal = time;
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
          this._myInvitationService.getVisitorsForSelect(term).pipe(
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

  onChangeVisitor(myInvitation) {
    this._visitorService
      .checkVisitorStatus(myInvitation.visitor)
      .subscribe((res) => {
        if (res == true) {
          this.notify.error("This visitor is blacklisted...!", "", {
            timeOut: 3000,
          });
        }
      });
  }

  save(): void {
    this.saving = true;

    const myInvitation = new AppointmentDto();
    myInvitation.init(this.myInvitation);

    let mom = moment(this.myInvitationTimeVal);
    myInvitation.time = mom;

    myInvitation.time.utcOffset(0, true).format();

    this._myInvitationService
      .update(myInvitation)
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
