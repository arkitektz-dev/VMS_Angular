import { Component, Injector, ChangeDetectionStrategy } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { AbpSessionService } from "abp-ng2-module";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  DashboardServiceProxy,
  TenantStatisticsDto,
} from "@shared/service-proxies/service-proxies";
import { Subject } from "rxjs";
import { finalize } from "rxjs/operators";
@Component({
  templateUrl: "./home.component.html",
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends AppComponentBase {
  // admin data
  public totalTenants$ = new Subject<number>();
  public activeTenants$ = new Subject<number>();
  public inActiveTenants$ = new Subject<number>();
  public recentTenants = [];

  //tenant data
  public todayTotalAppointments$ = new Subject<number>();
  public todayCompletedAppointments$ = new Subject<number>();
  public lastWeekTotalAppointments$ = new Subject<number>();
  public lastWeekCompletedAppointments$ = new Subject<number>();
  public employeeAppointments = [];

  //chart data
  public barChartLabels = [];
  public barChartData = [];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            precision: 0,
          },
        },
      ],
    },
  };
  public barChartType = "bar";
  public barChartLegend = true;

  constructor(
    injector: Injector,
    private _dashboardServiceProxy: DashboardServiceProxy,
    public _abpSessionService: AbpSessionService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (this._abpSessionService.tenantId) {
      this._dashboardServiceProxy
        .getTenantStatistics()
        .pipe(finalize(() => {}))
        .subscribe((result: TenantStatisticsDto) => {
          this.todayTotalAppointments$.next(result.todayTotalAppointments);
          this.todayCompletedAppointments$.next(
            result.todayCompletedAppointments
          );
          this.lastWeekTotalAppointments$.next(
            result.lastWeekTotalAppointments
          );
          this.lastWeekCompletedAppointments$.next(
            result.lastWeekCompletedAppointments
          );
          this.barChartLabels = result.barChartData.map(
            (c) => c.dateLabel + " " + c.monthLabel
          );

          this.barChartData = [
            {
              data: result.barChartData.map((c) => c.totalAppointments),
              label: "Total",
            },
            {
              data: result.barChartData.map((c) => c.completedAppointments),
              label: "Completed",
            },
          ];

          this.employeeAppointments = result.employeeAppointments;
        });
    } else {
      this._dashboardServiceProxy
        .getAdminStatistics()
        .pipe(finalize(() => {}))
        .subscribe((result) => {
          this.totalTenants$.next(result.totalTenants);
          this.activeTenants$.next(result.activeTenants);
          this.inActiveTenants$.next(result.inActiveTenants);
          this.recentTenants = result.recentTenants;
          this.barChartLabels = result.barChartData.map((c) => c.monthLabel);
          // console.log(result);

          this.barChartData = [
            {
              data: result.barChartData.map((c) => c.tenantCount),
              label: "Registered Tenants",
            },
          ];
        });
    }
  }
}
