import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AccountComponent } from "./account.component";
import { CallbackComponent } from "./okta-callback/okta-callback.component";
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
      { path: "login/callback", component: CallbackComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
