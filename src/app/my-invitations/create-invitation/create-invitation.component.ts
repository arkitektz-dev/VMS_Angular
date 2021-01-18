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
  MyInvitationServiceProxy,
  MyInvitationDto,
  VisitorDto,
  VisitorServiceProxy,
  VisitorListDto,
  CreateVisitorDto,
} from "@shared/service-proxies/service-proxies";
import { forEach as _forEach, map as _map } from "lodash-es";
import * as moment from "moment";

@Component({
  templateUrl: "create-invitation.component.html",
})
export class CreateInvitationComponent
  extends AppComponentBase
  implements OnInit {
  saving = false;

  visitor = new VisitorDto();

  minDate = new Date();

  isVisitorAdd = false;

  myInvitation = new MyInvitationDto();

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

  ngOnInit(): void {
    this.loadVisitor();
    // Create the new date
  }

  save(): void {
    this.saving = true;

    const myInvitation = new MyInvitationDto();

    myInvitation.init(this.myInvitation);

    myInvitation.time.utcOffset(0, true).format();

    this._myInvitationService
      .create(myInvitation)
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

  AddVisitorShow() {
    this.isVisitorAdd = true;
  }
  CancelVisitorShow() {
    this.isVisitorAdd = false;
  }
  onChangeVisitor(myInvitation) {
    this._visitorService
      .checkVisitorStatus(myInvitation.visitorId)
      .subscribe((res) => {
        if (res == true) {
          this.notify.error("This visitor is blacklisted...!", "", {
            timeOut: 3000,
          });
        }
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
