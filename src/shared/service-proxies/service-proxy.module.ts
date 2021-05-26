import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AbpHttpInterceptor } from "abp-ng2-module";

import * as ApiServiceProxies from "./service-proxies";

@NgModule({
  providers: [
    ApiServiceProxies.DashboardServiceProxy,
    ApiServiceProxies.VisitorServiceProxy,
    ApiServiceProxies.AppointmentServiceProxy,
    ApiServiceProxies.AssignedSitesServiceProxy,
    ApiServiceProxies.SiteServiceProxy,
    ApiServiceProxies.AppointmentStatusServiceProxy,
    ApiServiceProxies.MyInvitationServiceProxy,
    ApiServiceProxies.AppointmentQrcodeServiceProxy,
    ApiServiceProxies.MyInvitationQrcodeServiceProxy,
    ApiServiceProxies.RoleServiceProxy,
    ApiServiceProxies.SessionServiceProxy,
    ApiServiceProxies.TenantServiceProxy,
    ApiServiceProxies.UserServiceProxy,
    ApiServiceProxies.TokenAuthServiceProxy,
    ApiServiceProxies.AccountServiceProxy,
    ApiServiceProxies.ConfigurationServiceProxy,
    { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true },
  ],
})
export class ServiceProxyModule {}
