import { AbpSessionService } from "abp-ng2-module";
import { SessionServiceProxy } from "./../../shared/service-proxies/service-proxies";
import { Component, Injector, OnInit } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  Router,
  RouterEvent,
  NavigationEnd,
  PRIMARY_OUTLET,
} from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
import { MenuItem } from "@shared/layout/menu-item";

@Component({
  selector: "sidebar-menu",
  templateUrl: "./sidebar-menu.component.html",
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
  menuItems: MenuItem[];
  menuItemsMap: { [key: number]: MenuItem } = {};
  activatedMenuItems: MenuItem[] = [];
  routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  homeRoute = "/app/home";

  constructor(
    injector: Injector,
    private router: Router,
    private _sessionService: AbpSessionService
  ) {
    super(injector);
    this.router.events.subscribe(this.routerEvents);
  }

  ngOnInit(): void {
    this.menuItems = this.getMenuItems();
    this.patchMenuItems(this.menuItems);
    this.routerEvents
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentUrl = event.url !== "/" ? event.url : this.homeRoute;
        const primaryUrlSegmentGroup =
          this.router.parseUrl(currentUrl).root.children[PRIMARY_OUTLET];
        if (primaryUrlSegmentGroup) {
          this.activateMenuItems("/" + primaryUrlSegmentGroup.toString());
        }
      });
  }

  getMenuItems(): MenuItem[] {
    return [
      new MenuItem(
        this.l("HomePage"),
        "/app/home",
        "fas fa-home",
        null,
        "The main page of the application."
      ),
      new MenuItem(
        this.l("Probe Application"),
        "/app/download",
        "fas fa-home",
        "Pages.DownloadProbeApplication",
        "The main page of the application."
      ),
      new MenuItem(
        this.l("Login options"),
        "/app/loginOption",
        "fas fa-home",
        "Pages.LoginOptions",
        "The main page of the application."
      ),
      new MenuItem(
        this.l("Upload Logo"),
        "/app/upload-logo",
        "fas fa-home",
        "Pages.UploadLogo",
        "The main page of the application."
      ),
      new MenuItem(
        this.l("My Invitations"),
        "/app/myinvitations",
        "fas fa-handshake",
        "Pages.MyInvitations",
        "This option displays the list of invitations you have created, you can view the upcoming visitors as well as the all the invitations created along with the statuses."
      ),
      new MenuItem(
        this.l("Reception"),
        "/app/appointments",
        "fas fa-handshake",
        "Pages.Appointments",
        "This option displays the list of upcoming visitors requested by the company to the front desk officer."
      ),
      new MenuItem(
        this.l("Tenants"),
        "/app/tenants",
        "fas fa-building",
        "Pages.Tenants",
        "View the list of companies being managed by this application."
      ),
      new MenuItem(
        this.l("Visitors"),
        "/app/visitors",
        "fas fa-user",
        "Pages.Visitors",
        "This is the master list of all the visitors who have either already completed their visits or are scheduled in the future."
      ),
      new MenuItem(
        this.l("Assigned Sites"),
        "/app/assignedsites",
        "fas fa-user-check",
        "Pages.Sites",
        "This option enables the previleges user to assign the company sites to the employees, which then allows the employees to schedule the visits for that particular company site."
      ),

      new MenuItem(
        this.l("Sites"),
        "/app/sites",
        "fas fa-warehouse",
        "Pages.Sites",
        "This option enables the previleged user to manage the company sites. A site can be a location where this application can be used for scheduling the visits."
      ),
      new MenuItem(
        this.l("Status Master"),
        "/app/appointmentStatus",
        "fas fa-cog",
        "Pages.Sites",
        "This option shows the available statuses which can be marked against each scheduled visit."
      ),

      new MenuItem(
        this._sessionService.tenantId == null
          ? this.l("Users")
          : this.l("Users"),
        this._sessionService.tenantId == null ? "/app/users" : "/app/users", //employees
        "fas fa-users",
        "Pages.Users",
        "This option displays the list of users who can access this application, these users can be created and deleted by the previleged user."
      ),
      new MenuItem(
        this.l("Roles"),
        "/app/roles",
        "fas fa-theater-masks",
        "Pages.Roles",
        "This option allows the previleged user to create the access roles for other users to assign and manage this application."
      ),
      // new MenuItem(this.l('About'), '/app/about', 'fas fa-info-circle'),
      // new MenuItem(this.l('MultiLevelMenu'), '', 'fas fa-circle', '', [
      //   new MenuItem('ASP.NET Boilerplate', '', 'fas fa-dot-circle', '', [
      //     new MenuItem(
      //       'Home',
      //       'https://aspnetboilerplate.com?ref=abptmpl',
      //       'far fa-circle'
      //     ),
      //     new MenuItem(
      //       'Templates',
      //       'https://aspnetboilerplate.com/Templates?ref=abptmpl',
      //       'far fa-circle'
      //     ),
      //     new MenuItem(
      //       'Samples',
      //       'https://aspnetboilerplate.com/Samples?ref=abptmpl',
      //       'far fa-circle'
      //     ),
      //     new MenuItem(
      //       'Documents',
      //       'https://aspnetboilerplate.com/Pages/Documents?ref=abptmpl',
      //       'far fa-circle'
      //     ),
      //   ]),
      //   new MenuItem('ASP.NET Zero', '', 'fas fa-dot-circle', '', [
      //     new MenuItem(
      //       'Home',
      //       'https://aspnetzero.com?ref=abptmpl',
      //       'far fa-circle'
      //     ),
      //     new MenuItem(
      //       'Features',
      //       'https://aspnetzero.com/Features?ref=abptmpl',
      //       'far fa-circle'
      //     ),
      //     new MenuItem(
      //       'Pricing',
      //       'https://aspnetzero.com/Pricing?ref=abptmpl#pricing',
      //       'far fa-circle'
      //     ),
      //     new MenuItem(
      //       'Faq',
      //       'https://aspnetzero.com/Faq?ref=abptmpl',
      //       'far fa-circle'
      //     ),
      //     new MenuItem(
      //       'Documents',
      //       'https://aspnetzero.com/Documents?ref=abptmpl',
      //       'far fa-circle'
      //     )
      //   ])
      // ])
    ];
  }

  patchMenuItems(items: MenuItem[], parentId?: number): void {
    items.forEach((item: MenuItem, index: number) => {
      item.id = parentId ? Number(parentId + "" + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (parentId || item.children) {
        this.menuItemsMap[item.id] = item;
      }
      if (item.children) {
        this.patchMenuItems(item.children, item.id);
      }
    });
  }

  activateMenuItems(url: string): void {
    this.deactivateMenuItems(this.menuItems);
    this.activatedMenuItems = [];
    const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
    foundedItems.forEach((item) => {
      this.activateMenuItem(item);
    });
  }

  deactivateMenuItems(items: MenuItem[]): void {
    items.forEach((item: MenuItem) => {
      item.isActive = false;
      item.isCollapsed = true;
      if (item.children) {
        this.deactivateMenuItems(item.children);
      }
    });
  }

  findMenuItemsByUrl(
    url: string,
    items: MenuItem[],
    foundedItems: MenuItem[] = []
  ): MenuItem[] {
    items.forEach((item: MenuItem) => {
      if (item.route === url) {
        foundedItems.push(item);
      } else if (item.children) {
        this.findMenuItemsByUrl(url, item.children, foundedItems);
      }
    });
    return foundedItems;
  }

  activateMenuItem(item: MenuItem): void {
    item.isActive = true;
    if (item.children) {
      item.isCollapsed = false;
    }
    this.activatedMenuItems.push(item);
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]);
    }
  }

  isMenuItemVisible(item: MenuItem): boolean {
    if (!item.permissionName) {
      return true;
    }
    return this.permission.isGranted(item.permissionName);
  }
}
