import { AppointmentStatusesComponent } from "./appointment-statuses/appointment-statuses.component";
import { MyInvitationQrcodeDataComponent } from "./my-invitation-qrcode-data/my-invitation-qrcode-data.component";
import { AppointmentQrcodeDataComponent } from "./appointment-qrcode-data/appointment-qrcode-data.component";
import { MyInvitationsComponent } from "./my-invitations/my-invitations.component";
import { AssignedSitesComponent } from "@app/assigned-sites/assigned-sites.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { UsersComponent } from "./users/users.component";
import { TenantsComponent } from "./tenants/tenants.component";
import { RolesComponent } from "app/roles/roles.component";
import { ChangePasswordComponent } from "./users/change-password/change-password.component";
import { VisitorsComponent } from "./visitors/visitors.component";
import { SitesComponent } from "./sites/sites.component";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { DownloadSetupComponent } from "./download-setup/download-setup.component";
import { LoginOptionComponent } from "./login-option/login-option.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: AppComponent,
        children: [
          {
            path: "home",
            component: HomeComponent,
            canActivate: [AppRouteGuard],
          },
          {
            path: "download",
            component: DownloadSetupComponent,
            data: { permission: "Pages.DownloadProbeApplication" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "loginOption",
            component: LoginOptionComponent,
            data: { permission: "Pages.LoginOptions" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "appointmentStatus",
            component: AppointmentStatusesComponent,
            data: { permission: "Pages.AppointmentStatus" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "users",
            component: UsersComponent,
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "employees",
            component: UsersComponent,
            data: { permission: "Pages.Users" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "appointmentData/:id",
            component: AppointmentQrcodeDataComponent,
            data: { permission: "Pages.AppointmentQrcode" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "invitationData/:id",
            component: MyInvitationQrcodeDataComponent,
            data: { permission: "Pages.MyInvitationsQrcode" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "roles",
            component: RolesComponent,
            data: { permission: "Pages.Roles" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "tenants",
            component: TenantsComponent,
            data: { permission: "Pages.Tenants" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "myinvitations",
            component: MyInvitationsComponent,
            data: { permission: "Pages.MyInvitations" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "appointments",
            component: AppointmentsComponent,
            data: { permission: "Pages.Appointments" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "assignedsites",
            component: AssignedSitesComponent,
            data: { permission: "Pages.AssignedSites" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "sites",
            component: SitesComponent,
            data: { permission: "Pages.Sites" },
            canActivate: [AppRouteGuard],
          },
          {
            path: "visitors",
            component: VisitorsComponent,
            data: { permission: "Pages.Visitors" },
            canActivate: [AppRouteGuard],
          },
          { path: "about", component: AboutComponent },
          { path: "update-password", component: ChangePasswordComponent },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
