import {
  Component,
  ChangeDetectionStrategy,
  Injector,
  OnInit,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";

@Component({
  selector: "sidebar-logo",
  templateUrl: "./sidebar-logo.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarLogoComponent extends AppComponentBase implements OnInit {
  shownLoginName = "";
  logo = "";
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.logo = this.appSession.getLogo();

    if (this.appSession.getShownLoginName().split("\\")[0].length == 1) {
      this.shownLoginName = "VMS";
    } else {
      this.shownLoginName =
        this.appSession.getShownLoginName().split("\\")[0] + " - VMS";
    }
  }
}
