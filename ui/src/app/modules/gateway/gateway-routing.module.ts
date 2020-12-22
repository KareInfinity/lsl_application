import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { SettingsGlobalGuard } from "../global/guards/settings/settings.global.guard";
import { GatewayComponent } from "./gateway.component";
import { DashboardGatewayComponent } from "./containers/dashboard/dashboard.gateway.component";
import { UserAuthGuard } from "../auth/guards/user/user.auth.guard";
import { ConfigurationGatewayComponent } from "./containers/configuration/configuration.gateway.component";
import { DeviceMasterGatewayComponent } from "./containers/device_master/device_master.gateway.component";
import { MastersGatewayComponent } from "./containers/masters/masters.gateway.component";
import { DeviceMergeGatewayComponent } from "./containers/device-merge/device-merge.gateway.component";
import { ImportDevicesGatewayComponent } from "./containers/import-devices/import-devices.gateway.component";
import { NotificationViewerGatewayComponent } from "./containers/notificationviewer/notificationviewer.gateway.component";
import { ImportCablesGatewayComponent } from "./containers/import-cabledrivermap/import-cabledrivermap.gateway.component";
import { InventoryStatusMergeGatewayComponent } from "./containers/inventory-status-merge/inventory-status-merge.gateway.component";
import { PeopleGatewayComponent } from "./containers/people/people.gateway.component";
import { InventoryStatusGatewayComponent } from "./containers/inventory-status/inventory-status.gateway.component";
import { DeviceConfigurationGatewayComponent } from "./containers/configuration/children/device-configuration/device.configuration.gateway.component";
import { ScreenConfigurationGatewayComponent } from "./containers/configuration/children/screen-configuration/screen.configuration.gateway.component";
const gateway_routes: Routes = [
  {
    path: "",
    component: GatewayComponent,
    children: [
      {
        path: "",
        redirectTo: "devices",
        pathMatch: "full",
      },
      {
        path: "devices",
        component: DeviceMasterGatewayComponent,
        canActivate: [UserAuthGuard],
      },
      {
        path: "people",
        component: PeopleGatewayComponent,
        canActivate: [UserAuthGuard],
      },
      {
        path: "inventorystatus",
        component: InventoryStatusGatewayComponent,
        canActivate: [UserAuthGuard],
      },
      {
        path: "master",
        component: MastersGatewayComponent,
        canActivate: [UserAuthGuard],
      },
      {
        path: "devices/device-merge",
        component: DeviceMergeGatewayComponent,
        canActivate: [UserAuthGuard],
      },
      {
        path: "devices/import-devices",
        component: ImportDevicesGatewayComponent,
        canActivate: [UserAuthGuard],
      },
      {
        path: "inventorystatus/inventory-status-merge",
        component: InventoryStatusMergeGatewayComponent,
        canActivate: [UserAuthGuard],
      },
      {
        path: "active",
        component: DashboardGatewayComponent,
        canActivate: [UserAuthGuard],
      },
      {
        path: "configuration",
        component: ConfigurationGatewayComponent,
        canActivate: [UserAuthGuard],
        children: [
          {
            path: "",
            redirectTo: "device",
            pathMatch: "full",
          },
          {
            path: "device",
            component: DeviceConfigurationGatewayComponent,
            canActivate: [UserAuthGuard],
          },
          {
            path: "screen",
            component: ScreenConfigurationGatewayComponent,
            canActivate: [UserAuthGuard],
          },
        ],
      },
      {
        path: "configuration/import-cables",
        component: ImportCablesGatewayComponent,
        canActivate: [UserAuthGuard],
      },
      {
        path: "notificationviewer",
        component: NotificationViewerGatewayComponent,
        canActivate: [UserAuthGuard],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(gateway_routes)],
  exports: [RouterModule],
})
export class GatewayRoutingModule {}
