import { EventEmitterService } from "./../services/event-emitter.service";
import { Observable, ReplaySubject } from "rxjs";
import {
  AssignedSitesServiceProxy,
  GetCurrentLoginInformationsOutput,
  SessionServiceProxy,
  SitesListDto,
} from "./../../shared/service-proxies/service-proxies";
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "header-sites-menu",
  templateUrl: "./header-sites-menu.component.html",
})
export class HeaderSitesMenuComponent implements OnInit {
  private currentSites = new ReplaySubject<SitesListDto[]>();

  isSitesSelectShow = true;
  sites$ = this.currentSites.asObservable();

  currentLoginInfo$: Observable<GetCurrentLoginInformationsOutput>;

  defaultSiteId: number;

  constructor(
    private _assingedSiteService: AssignedSitesServiceProxy,
    private _sessionService: SessionServiceProxy,
    private _eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    if (abp.session.tenantId !== null) {
      this.sites$ = this._assingedSiteService.getAssignedSitesForLogInUser();
      this.defaultSiteId = parseInt(abp.setting.get("UserSelectedSiteId"));
    } else {
      this.isSitesSelectShow = false;
    }

    //console.log(this.currentLoginInfo$);
    // this._siteListDataService.currentData.subscribe((dataStub) => {
    //   this.dataSubject = dataStub;
    //   if (this.dataSubject.length !== 0) {
    //     console.log(this.dataSubject);
    //     this.sites$ = this.dataSubject;
    //   }
    // });
  }
  // ngAfterViewInit(): void {
  //   this.sites$ = this.assignedSite.sitesListObject;
  // }

  onSiteChange(event) {
    this._sessionService
      .updateSelectedSiteId(event.target.value)
      .subscribe((res) => {
        this.defaultSiteId = res;
        console.log(this.defaultSiteId);
        this._eventEmitterService.onChangeOfSiteId();
      });
  }
}
