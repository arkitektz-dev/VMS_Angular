import { EventEmitterService } from "./services/event-emitter.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientJsonpModule } from "@angular/common/http";
import { HttpClientModule } from "@angular/common/http";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelectModule } from "@ng-select/ng-select";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { TooltipModule } from "ngx-bootstrap/tooltip";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ServiceProxyModule } from "@shared/service-proxies/service-proxy.module";
import { SharedModule } from "@shared/shared.module";
import { HomeComponent } from "@app/home/home.component";
import { AboutComponent } from "@app/about/about.component";
// tenants
import { TenantsComponent } from "@app/tenants/tenants.component";
import { CreateTenantDialogComponent } from "./tenants/create-tenant/create-tenant-dialog.component";
import { EditTenantDialogComponent } from "./tenants/edit-tenant/edit-tenant-dialog.component";
// roles
import { RolesComponent } from "@app/roles/roles.component";
import { CreateRoleDialogComponent } from "./roles/create-role/create-role-dialog.component";
import { EditRoleDialogComponent } from "./roles/edit-role/edit-role-dialog.component";
// users
import { UsersComponent } from "@app/users/users.component";
import { CreateUserDialogComponent } from "@app/users/create-user/create-user-dialog.component";
import { EditUserDialogComponent } from "@app/users/edit-user/edit-user-dialog.component";
import { ChangePasswordComponent } from "./users/change-password/change-password.component";
import { ResetPasswordDialogComponent } from "./users/reset-password/reset-password.component";

// visitors
import { VisitorsComponent } from "@app/visitors/visitors.component";
import { CreateVisitorDialogComponent } from "@app/visitors/create-visitor/create-visitor-dialog.component";
import { EditVisitorDialogComponent } from "@app/visitors/edit-visitor/edit-visitor-dialog.component";

// sites
import { SitesComponent } from "@app/sites/sites.component";
import { CreateSiteDialogComponent } from "@app/sites/create-site/create-site-dialog.component";
import { EditSiteDialogComponent } from "@app/sites/edit-site/edit-site-dialog.component";

//assigned sites
import { AssignedSitesComponent } from "@app/assigned-sites/assigned-sites.component";
import { EditAssignedSiteDialogComponent } from "@app/assigned-sites/edit-assigned-site/edit-assigned-site.component";

//appointment

import { AppointmentsComponent } from "./appointments/appointments.component";
import { CreateAppointmentComponent } from "@app/appointments/create-appointment/create-appointment.component";
import { EditAppointmentComponent } from "@app/appointments/edit-appointment/edit-appointment.component";
import { DetailAppointmentComponent } from "@app/appointments/detail-appointment/detail-appointment.component";

//My invitation
import { MyInvitationsComponent } from "./my-invitations/my-invitations.component";
import { CreateInvitationComponent } from "./my-invitations/create-invitation/create-invitation.component";
import { EditInvitationComponent } from "./my-invitations/edit-invitation/edit-invitation.component";
import { DetailInvitationComponent } from "@app/my-invitations/detail-invitation/detail-invitation.component";

// Appointment Status
import { AppointmentStatusesComponent } from "./appointment-statuses/appointment-statuses.component";
import { CreateAppointmentStatusComponent } from "./appointment-statuses/create-appointment-status/create-appointment-status.component";
import { EditAppointmentStatusComponent } from "./appointment-statuses/edit-appointment-status/edit-appointment-status.component";

// layout
import { HeaderComponent } from "./layout/header.component";
import { HeaderLeftNavbarComponent } from "./layout/header-left-navbar.component";
import { HeaderLanguageMenuComponent } from "./layout/header-language-menu.component";
import { HeaderUserMenuComponent } from "./layout/header-user-menu.component";
import { HeaderSitesMenuComponent } from "./layout/header-sites-menu.component";

import { FooterComponent } from "./layout/footer.component";
import { SidebarComponent } from "./layout/sidebar.component";
import { SidebarLogoComponent } from "./layout/sidebar-logo.component";
import { SidebarUserPanelComponent } from "./layout/sidebar-user-panel.component";
import { SidebarMenuComponent } from "./layout/sidebar-menu.component";
import { AppointmentQrcodeDataComponent } from "./appointment-qrcode-data/appointment-qrcode-data.component";
import { MyInvitationQrcodeDataComponent } from "./my-invitation-qrcode-data/my-invitation-qrcode-data.component";
import { DownloadSetupComponent } from "./download-setup/download-setup.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,

    DownloadSetupComponent,
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,

    //visitors
    VisitorsComponent,
    CreateVisitorDialogComponent,
    EditVisitorDialogComponent,

    //sites
    SitesComponent,
    CreateSiteDialogComponent,
    EditSiteDialogComponent,

    //assigned sites
    AssignedSitesComponent,
    EditAssignedSiteDialogComponent,

    //appointments
    AppointmentsComponent,
    CreateAppointmentComponent,
    EditAppointmentComponent,
    DetailAppointmentComponent,

    //invitation
    MyInvitationsComponent,
    CreateInvitationComponent,
    EditInvitationComponent,
    DetailInvitationComponent,

    //appointment status
    AppointmentStatusesComponent,
    CreateAppointmentStatusComponent,
    EditAppointmentStatusComponent,
    // layout
    HeaderComponent,
    HeaderLeftNavbarComponent,
    HeaderLanguageMenuComponent,
    HeaderUserMenuComponent,
    HeaderSitesMenuComponent,
    FooterComponent,
    SidebarComponent,
    SidebarLogoComponent,
    SidebarUserPanelComponent,
    SidebarMenuComponent,
    AppointmentQrcodeDataComponent,
    MyInvitationQrcodeDataComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ModalModule.forChild(),
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  providers: [EventEmitterService],
  entryComponents: [
    // tenants
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent,

    //visitors
    CreateVisitorDialogComponent,
    EditVisitorDialogComponent,

    //sites
    CreateSiteDialogComponent,
    EditSiteDialogComponent,

    //appointment
    CreateAppointmentComponent,
    EditAppointmentComponent,
    DetailAppointmentComponent,

    //invitation
    CreateInvitationComponent,
    EditInvitationComponent,
    DetailInvitationComponent,

    //appointment status
    CreateAppointmentStatusComponent,
    EditAppointmentStatusComponent,
  ],
})
export class AppModule {}
