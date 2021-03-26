import { Component, Injector } from "@angular/core";
import { AbpSessionService } from "abp-ng2-module";
import { AppComponentBase } from "@shared/app-component-base";
import { accountModuleAnimation } from "@shared/animations/routerTransition";
import { AppAuthService } from "@shared/auth/app-auth.service";
import { OktaAuthService } from "@okta/okta-angular";
import { OktaAuth } from "@okta/okta-auth-js";
import { Observable, Observer } from "rxjs";
import { TenantServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { LoginOptionDto } from "../../shared/service-proxies/service-proxies";
import * as AdfsAuthContext from "adal-angular";
import * as Msal from "msal";


@Component({
  templateUrl: "./login.component.html",
  animations: [accountModuleAnimation()],
})
export class LoginComponent extends AppComponentBase {
  submitting = false;
  isAuthenticated: boolean;
  isTenantSelected: boolean;
  oktaAuth: any;
  adfsAuth: any;
  loginOptionDto: LoginOptionDto = new LoginOptionDto();

  constructor(
    injector: Injector,
    public authService: AppAuthService,
    private _sessionService: AbpSessionService,
    private _configurationsService: TenantServiceProxy // public oktaAuth: OktaAuthService
  ) {
    super(injector);
    // Subscribe to authentication state changes
    // this.oktaAuth.$authenticationState.subscribe(
    //   (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
    // );
  }

  async ngOnInit() {
    // this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    this.isTenantSelected = !!abp.multiTenancy.getTenantIdCookie();
    if (this.isTenantSelected) {
      this._configurationsService
        .getLoginOptions()
        .pipe(finalize(() => {}))
        .subscribe((result) => {
          console.log(result);

          this.loginOptionDto = result;

          if(this.loginOptionDto.loginOkta) {
            this.oktaAuth = new OktaAuth({
              issuer: `https://${result.oktaDomainName}`,
              clientId: result.oktaClientId,
              redirectUri: `http://${window.location.host}/account/login/callback`,
              pkce: true,
              scopes: ["openid", "profile", "email"],
            });
          }

          if(this.loginOptionDto.loginActiveDirectory) {
            this.adfsAuth = new AdfsAuthContext({
              instance: `https://${result.adfsInstanceName}/`,
              tenant: "adfs",
              clientId: result.adfsClientId,
              redirectUri:
                window.location.origin + "/account/login/adfs-callback",
            });
          }

        });
    } else {
      this.loginOptionDto.loginNormal = true;
      this.loginOptionDto.loginOkta = false;
      this.loginOptionDto.loginActiveDirectory = false;
    }
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
    this.oktaAuth.signInWithRedirect();
  }

  loginWithAdfs() {
    this.adfsAuth.login();
  }
}
