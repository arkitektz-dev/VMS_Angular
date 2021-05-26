import { Component, Injector, ChangeDetectionStrategy } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { DashboardServiceProxy } from "@shared/service-proxies/service-proxies";
import { Subject } from "rxjs";
import { finalize } from "rxjs/operators";
@Component({
  templateUrl: "./home.component.html",
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends AppComponentBase {
  public totalTenants$ = new Subject<number>();
  public activeTenants$ = new Subject<number>();
  public inActiveTenants$ = new Subject<number>();
  public recentTenants = [];
  public barChartLabels = [];
  public barChartData = [];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartType = "bar";
  public barChartLegend = true;

  constructor(injector: Injector, private _dashboardServiceProxy: DashboardServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this._dashboardServiceProxy.getAdminStatistics().pipe(finalize(() => { })).subscribe((result) => {
      this.totalTenants$.next(result.totalTenants);
      this.activeTenants$.next(result.activeTenants);
      this.inActiveTenants$.next(result.inActiveTenants);
      this.recentTenants = result.recentTenants;
      this.barChartLabels = result.barChartData.map(c => c.monthLabel);
      console.log(result);
      
      this.barChartData = [
        {
          data: result.barChartData.map(c => c.tenantCount),
          label: 'Registered Tenants'
        }
      ];
    })
  }

}
