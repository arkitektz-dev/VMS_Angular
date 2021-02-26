import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientJsonpModule } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { ModalModule } from "ngx-bootstrap/modal";
import { AccountRoutingModule } from "./account-routing.module";
import { ServiceProxyModule } from "@shared/service-proxies/service-proxy.module";
import { SharedModule } from "@shared/shared.module";
import { AccountComponent } from "./account.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { OktaRedirectComponent } from "./okta-redirect/okta-redirect.component";
import { AccountLanguagesComponent } from "./layout/account-languages.component";
import { AccountHeaderComponent } from "./layout/account-header.component";
import { AccountFooterComponent } from "./layout/account-footer.component";
// tenants
import { TenantChangeComponent } from "./tenant/tenant-change.component";
import { TenantChangeDialogComponent } from "./tenant/tenant-change-dialog.component";

import { OKTA_CONFIG, OktaAuthModule } from "@okta/okta-angular";
import config from "./okta.config";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    SharedModule,
    ServiceProxyModule,
    OktaAuthModule,
    AccountRoutingModule,
    ModalModule.forChild(),
  ],
  providers: [{ provide: OKTA_CONFIG, useValue: config }],
  declarations: [
    AccountComponent,
    LoginComponent,
    RegisterComponent,
    OktaRedirectComponent,
    AccountLanguagesComponent,
    AccountHeaderComponent,
    AccountFooterComponent,
    // tenant
    TenantChangeComponent,
    TenantChangeDialogComponent,
  ],
  entryComponents: [
    // tenant
    TenantChangeDialogComponent,
  ],
})
export class AccountModule {}
