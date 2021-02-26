import { Component, Injector } from "@angular/core";
import { AbpSessionService } from "abp-ng2-module";
import { AppComponentBase } from "@shared/app-component-base";
import { accountModuleAnimation } from "@shared/animations/routerTransition";
import { AppAuthService } from "@shared/auth/app-auth.service";
import { OktaAuthService } from "@okta/okta-angular";
import { AuthenticateWithOktaModel } from "@shared/service-proxies/service-proxies";

@Component({
  templateUrl: "./okta-redirect.component.html",
  animations: [accountModuleAnimation()],
})
export class OktaRedirectComponent extends AppComponentBase {
  constructor(
    injector: Injector,
    public authService: AppAuthService,
    public oktaAuth: OktaAuthService
  ) {
    super(injector);
  }

  async ngOnInit() {
    const userClaims = await this.oktaAuth.getUser();
    var authenticateWithOktaModel = new AuthenticateWithOktaModel();
    authenticateWithOktaModel.userNameOrEmailAddress = userClaims.email;
    this.authService.authenticateWithOkta(authenticateWithOktaModel);
  }
}
