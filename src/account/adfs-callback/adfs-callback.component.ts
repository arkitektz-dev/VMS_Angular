import { Component, Injector } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { accountModuleAnimation } from "@shared/animations/routerTransition";
import { AppAuthService } from "@shared/auth/app-auth.service";
import { TenantServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import * as AdfsAuthContext from "adal-angular";

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
        this.adfsAuth = new AdfsAuthContext({
          instance: "https://dc01.servicenowtrainer.com/",
          tenant: "adfs",
          clientId: "d418e598-14e5-49cd-ba2b-aa0225da4075",
          redirectUri: window.location.origin + "/account/login/adfs-callback",
        });
        const adfsUser = this.adfsAuth.getCachedUser();
        console.log(adfsUser);
      });
  }
}
