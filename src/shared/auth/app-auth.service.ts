import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { TokenService, LogService, UtilsService } from "abp-ng2-module";
import { AppConsts } from "@shared/AppConsts";
import { UrlHelper } from "@shared/helpers/UrlHelper";
import {
  AuthenticateModel,
  AuthenticateWithOktaModel,
  AuthenticateResultModel,
  TokenAuthServiceProxy,
  AuthenticateWithAdfsModel,
} from "@shared/service-proxies/service-proxies";
import { OktaAuth } from "@okta/okta-auth-js";
import { Observable, Observer, ReplaySubject } from "rxjs";
import { TenantServiceProxy } from "@shared/service-proxies/service-proxies";
@Injectable()
export class AppAuthService {
  authenticateModel: AuthenticateModel;
  authenticateWithOktaModel: AuthenticateWithOktaModel;
  authenticateResult: AuthenticateResultModel;
  rememberMe: boolean;

  constructor(
    private _tokenAuthService: TokenAuthServiceProxy,
    private _router: Router,
    private _utilsService: UtilsService,
    private _tokenService: TokenService,
    private _logService: LogService
  ) {
    this.clear();
  }

  async isAuthenticated(oktaAuth) {
    return !!(await oktaAuth.tokenManager.get("accessToken"));
  }

  async handleOktaAuthentication(oktaAuth) {
    // console.log(oktaAuth.token);

    const tokenContainer = await oktaAuth.token.parseFromUrl();
    // console.log(tokenContainer);

    // console.log(oktaAuth);

    oktaAuth.tokenManager.add("idToken", tokenContainer.tokens.idToken);
    oktaAuth.tokenManager.add("accessToken", tokenContainer.tokens.accessToken);

    if (await this.isAuthenticated(oktaAuth)) {
      var authenticateWithOktaModel = new AuthenticateWithOktaModel();
      authenticateWithOktaModel.userNameOrEmailAddress =
        tokenContainer.tokens.idToken.claims.email;
      authenticateWithOktaModel.oktaClientId =
        tokenContainer.tokens.idToken.clientId;
      this.authenticateWithOkta(authenticateWithOktaModel);
    }
  }

  async handleAdfsAuthentication(adfsAuth, adfsConfig) {
    const adfsUser = adfsAuth.getCachedUser();
    console.log(adfsUser);
    
    if (adfsUser) {
      var authenticateWithAdfsModel = new AuthenticateWithAdfsModel();
      authenticateWithAdfsModel.userNameOrEmailAddress =
        adfsUser.userName.split('@')[0];
        authenticateWithAdfsModel.adfsClientId = adfsConfig.clientId;
      this.authenticateWithAdfs(authenticateWithAdfsModel);
    }
  }

  ///////

  logout(reload?: boolean): void {
    abp.auth.clearToken();
    abp.utils.setCookieValue(
      AppConsts.authorization.encryptedAuthTokenName,
      undefined,
      undefined,
      abp.appPath
    );
    if (reload !== false) {
      location.href = AppConsts.appBaseUrl;
    }
  }

  authenticate(finallyCallback?: () => void): void {
    finallyCallback = finallyCallback || (() => {});

    this._tokenAuthService
      .authenticate(this.authenticateModel)
      .pipe(
        finalize(() => {
          finallyCallback();
        })
      )
      .subscribe((result: AuthenticateResultModel) => {
        this.processAuthenticateResult(result);
      });
  }

  authenticateWithOkta(
    authenticateWithOktaModel: AuthenticateWithOktaModel,
    finallyCallback?: () => void
  ): void {
    finallyCallback = finallyCallback || (() => {});

    this._tokenAuthService
      .authenticateWithOkta(authenticateWithOktaModel)
      .pipe(
        finalize(() => {
          finallyCallback();
        })
      )
      .subscribe(
        (result: AuthenticateResultModel) => {
          this.processAuthenticateResult(result);
        },
        () => this._router.navigate(["account/login"])
      );
  }

  authenticateWithAdfs(
    authenticateWithAdfsModel: AuthenticateWithAdfsModel,
    finallyCallback?: () => void
  ): void {
    finallyCallback = finallyCallback || (() => {});

    this._tokenAuthService
      .authenticateWithAdfs(authenticateWithAdfsModel)
      .pipe(
        finalize(() => {
          finallyCallback();
        })
      )
      .subscribe(
        (result: AuthenticateResultModel) => {
          this.processAuthenticateResult(result);
        },
        () => this._router.navigate(["account/login"])
      );
  }

  private processAuthenticateResult(
    authenticateResult: AuthenticateResultModel
  ) {
    this.authenticateResult = authenticateResult;

    if (authenticateResult.accessToken) {
      // Successfully logged in
      this.login(
        authenticateResult.accessToken,
        authenticateResult.encryptedAccessToken,
        authenticateResult.expireInSeconds,
        this.rememberMe
      );
    } else {
      // Unexpected result!

      this._logService.warn("Unexpected authenticateResult!");
      this._router.navigate(["account/login"]);
    }
  }

  private login(
    accessToken: string,
    encryptedAccessToken: string,
    expireInSeconds: number,
    rememberMe?: boolean
  ): void {
    const tokenExpireDate = rememberMe
      ? new Date(new Date().getTime() + 1000 * expireInSeconds)
      : undefined;

    this._tokenService.setToken(accessToken, tokenExpireDate);

    this._utilsService.setCookieValue(
      AppConsts.authorization.encryptedAuthTokenName,
      encryptedAccessToken,
      tokenExpireDate,
      abp.appPath
    );

    let initialUrl = UrlHelper.initialUrl;

    if (
      initialUrl.indexOf("/login") > 0 ||
      initialUrl.indexOf("/oktaredirect")
    ) {
      initialUrl = AppConsts.appBaseUrl;
    }

    location.href = initialUrl;
  }

  private clear(): void {
    this.authenticateModel = new AuthenticateModel();
    this.authenticateModel.rememberClient = false;
    this.authenticateResult = null;
    this.rememberMe = false;
  }
}
