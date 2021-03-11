import {
  Component,
  Injector,
  ChangeDetectionStrategy,
  OnInit,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  TenantServiceProxy,
  CreateLoginOptionDto,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
  templateUrl: "./login-option.component.html",
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginOptionComponent extends AppComponentBase implements OnInit {
  options: any = ["normal"];
  loginOptions = new CreateLoginOptionDto();

  constructor(
    injector: Injector,
    private _tenantServiceProxy: TenantServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._tenantServiceProxy.getLoginOptions().subscribe((result) => {
      console.log(result);
    });
  }

  isOptionChecked(option: string): boolean {
    // just return default permission checked status
    // it's better to use a setting
    console.log(this.options);
    if (this.options.length === 0) {
      this.options.push("normal");
    }

    return this.options.indexOf(option) !== -1 ? true : false;
  }

  isOptionDisabled(option: string): boolean {
    // just return default permission checked status
    // it's better to use a setting

    if (this.options.length === 1 && this.options.indexOf("normal") !== -1) {
      return true;
    } else {
      return false;
    }
  }

  onOptionChange(option) {
    const index = this.options.indexOf(option);
    if (index === -1) {
      this.options.push(option);
    } else {
      this.options.splice(index, 1);
    }

    console.log(this.options);
  }

  updateLoginOptions() {
    this.loginOptions.options = this.options;

    this._tenantServiceProxy
      .updateLoginOptions(this.loginOptions)
      .pipe(finalize(() => {}))
      .subscribe((result: boolean) => {
        console.log(result);
        this.notify.info(this.l("Request Submitted Successfully"));
      });
  }
}
