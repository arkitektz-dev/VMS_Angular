import { Component, Injector } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { accountModuleAnimation } from "@shared/animations/routerTransition";
import { AppAuthService } from "@shared/auth/app-auth.service";
import { TenantServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import * as AdfsAuthContext from "adal-angular";
import * as Msal from "msal";

@Component({
  templateUrl: "./adfs-callback.component.html",
  animations: [accountModuleAnimation()],
})
export class AdfsCallbackComponent extends AppComponentBase {
  adfsAuth: any;

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
        if(result.loginActiveDirectory) {
          const adfsConfig = {
            instance: `https://${result.adfsInstanceName}/`,
            tenant: "adfs",
            clientId: result.adfsClientId,
            redirectUri: window.location.origin + "/account/login/adfs-callback",
          };
          this.adfsAuth = new AdfsAuthContext(adfsConfig);
          var requestInfo = this.adfsAuth.getRequestInfo(window.location.hash);
          if (requestInfo.valid)
            this.adfsAuth.saveTokenFromHash(requestInfo); 

          this.authService.handleAdfsAuthentication(this.adfsAuth, adfsConfig);
        }
      });
  }
}
