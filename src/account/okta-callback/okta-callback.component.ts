import { Component, Injector } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { accountModuleAnimation } from "@shared/animations/routerTransition";
import { AppAuthService } from "@shared/auth/app-auth.service";
import { TenantServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { OktaAuth } from "@okta/okta-auth-js";

@Component({
  templateUrl: "./okta-callback.component.html",
  animations: [accountModuleAnimation()],
})
export class OktaCallbackComponent extends AppComponentBase {
  oktaAuth: any;

  constructor(
    injector: Injector,
    public authService: AppAuthService,
    private _configurationsService: TenantServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._configurationsService
      .getLoginOptions()
      .pipe(finalize(() => {}))
      .subscribe((result) => {
        this.oktaAuth = new OktaAuth({
          clientId: result.oktaClientId,
          issuer: `https://${result.oktaDomainName}`,
          redirectUri: `http://${window.location.host}/account/login/callback`,
          pkce: true,
          scopes: ["openid", "profile", "email"],
        });

        this.authService.handleOktaAuthentication(this.oktaAuth);
      });
  }
}
