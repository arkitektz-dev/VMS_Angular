import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AccountComponent } from "./account.component";
import { OktaCallbackComponent } from "@okta/okta-angular";
import { OktaRedirectComponent } from "./okta-redirect/okta-redirect.component";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: AccountComponent,
        children: [
          { path: "login", component: LoginComponent },
          { path: "register", component: RegisterComponent },
        ],
      },
    ]),
    RouterModule.forChild([
      { path: "login/callback", component: OktaCallbackComponent },
      {
        path: "oktaredirect",
        component: OktaRedirectComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
