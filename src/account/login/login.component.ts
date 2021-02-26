import { Component, Injector } from "@angular/core";
import { AbpSessionService } from "abp-ng2-module";
import { AppComponentBase } from "@shared/app-component-base";
import { accountModuleAnimation } from "@shared/animations/routerTransition";
import { AppAuthService } from "@shared/auth/app-auth.service";
import { OktaAuthService } from "@okta/okta-angular";

@Component({
  templateUrl: "./login.component.html",
  animations: [accountModuleAnimation()],
})
export class LoginComponent extends AppComponentBase {
  submitting = false;
  isAuthenticated: boolean;
  isTenantSelected: boolean;

  constructor(
    injector: Injector,
    public authService: AppAuthService,
    private _sessionService: AbpSessionService,
    public oktaAuth: OktaAuthService
  ) {
    super(injector);
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
    );
  }

  async ngOnInit() {
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    this.isTenantSelected = !!abp.multiTenancy.getTenantIdCookie();
  }

  get multiTenancySideIsTeanant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isSelfRegistrationAllowed(): boolean {
    //if (!this._sessionService.tenantId) {
    return false;
    //}

    //return true;
  }

  login(): void {
    this.submitting = true;
    this.authService.authenticate(() => (this.submitting = false));
  }

  loginWithOcta() {
    this.oktaAuth.signInWithRedirect({
      originalUri: "/account/oktaredirect",
    });
  }
}
