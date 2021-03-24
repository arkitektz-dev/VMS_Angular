import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AccountComponent } from "./account.component";
import { OktaCallbackComponent } from "./okta-callback/okta-callback.component";
import { AdfsCallbackComponent } from "./adfs-callback/adfs-callback.component";
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
      { path: "login/adfs-callback", component: AdfsCallbackComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
