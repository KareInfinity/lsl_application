import { NgModule, ModuleWithProviders } from "@angular/core";
/* module */
import { GlobalModule } from "../global/global.module";
import { GatewayComponent } from "./gateway.component";
import { GatewayRoutingModule } from "./gateway-routing.module";
import { SidebarGatewayComponent } from "./base/sidebar/sidebar.gateway.component";
import { HeaderGatewayComponent } from "./base/header/header.gateway.component";
import { DashboardGatewayComponent } from "./containers/dashboard/dashboard.gateway.component";
import { DeviceDataGatewayComponent } from "./containers/device_data/device_data.gateway.component";
import { ConfigurationGatewayComponent } from "./containers/configuration/configuration.gateway.component";
import { AssociateCableGatewayDialog } from "./dialogs/associatecable/associatecable.gateway.dialog";
import { PeopleGatewayComponent } from "./containers/people/people.gateway.component";
import { AssociatePeopleGatewayDialog } from "./dialogs/associatepeople/associatepeople.gateway.dialog";
import { DeviceinfoComponent } from "./dialogs/deviceinfo/deviceinfo.component";
import { DriverGatewayComponent } from "./containers/driver/driver.gateway.component";
import { CableGatewayComponent } from "./containers/cable/cable.gateway.component";
import { CustomActionFormatterComponent } from "./containers/device_data/custom-actionFormatter.component";
import { DexcominfoGatewayDialog } from "./dialogs/dexcominfo/dexcominfo.gateway.dialog";
import { DeviceNetworkHistoryDialog } from "./dialogs/devicenetworkhistory/devicenetworkhistory.component";
import { DeviceBatteryStatusHistoryDialog } from "./dialogs/devicebatteystatushistory/devicebatterystatushistory.component";
import { IdhSessionHistoryDialog } from "./dialogs/idhsessionhistory/idhsessionhistory.dialog";
import { DeviceMasterGatewayComponent } from "./containers/device_master/device_master.gateway.component";
import { MastersGatewayComponent } from "./containers/masters/masters.gateway.component";
import { DevicePeopleAssociationGatewayComponent } from "./containers/devicepeopleassociation/devicepeopleassociation.component";
import { DeviceAssociationLogsGatewayDialog } from "./dialogs/deviceassociationlogs/deviceassociationlogs.gateway.dialog";
import { PatientAssociationLogsGatewayDialog } from "./dialogs/patientassociationlogs/patientassociationlogs.gateway.dialog";
import { UserAssociationLogsGatewayDialog } from "./dialogs/userassociationlogs/userassociationlogs.gateway.dialog";
import { DeviceMergeGatewayComponent } from "./containers/device-merge/device-merge.gateway.component";
import { ImportDevicesGatewayComponent } from "./containers/import-devices/import-devices.gateway.component";
import { NotificationViewerGatewayComponent } from "./containers/notificationviewer/notificationviewer.gateway.component";
import { LoaderGatewayComponent } from "./base/loader/loader.gateway.component";
import { AlertGatewayDialog } from "./dialogs/alert/alert.gateway.dialog";
import { ImportCablesGatewayComponent } from "./containers/import-cabledrivermap/import-cabledrivermap.gateway.component";
import { DeviceLastSeenHistoryDialog } from "./dialogs/devicelastseenhistory/devicelastseenhistory.gateway.dialog";
import { SoftwareVersionHistoryDialog } from "./dialogs/softwareversionhistory/softwareversionhistory.gateway.dialog";
/* ui */

@NgModule({
  declarations: [
    /* ui */
    GatewayComponent,
    LoaderGatewayComponent,
    SidebarGatewayComponent,
    HeaderGatewayComponent,
    DashboardGatewayComponent,
    DeviceDataGatewayComponent,
    ConfigurationGatewayComponent,
    PeopleGatewayComponent,
    DeviceMasterGatewayComponent,
    MastersGatewayComponent,
    DevicePeopleAssociationGatewayComponent,
    DeviceinfoComponent,
    DriverGatewayComponent,
    CableGatewayComponent,
    CustomActionFormatterComponent,
    DeviceMergeGatewayComponent,
    ImportDevicesGatewayComponent,
    NotificationViewerGatewayComponent,
    ImportCablesGatewayComponent,
    /* Dialog */
    AssociateCableGatewayDialog,
    AssociatePeopleGatewayDialog,
    AlertGatewayDialog,
    DexcominfoGatewayDialog,
    DeviceNetworkHistoryDialog,
    DeviceBatteryStatusHistoryDialog,
    IdhSessionHistoryDialog,
    DeviceAssociationLogsGatewayDialog,
    UserAssociationLogsGatewayDialog,
    PatientAssociationLogsGatewayDialog,
    DeviceLastSeenHistoryDialog,
    SoftwareVersionHistoryDialog,
  ],
  imports: [
    /* modules */
    GatewayRoutingModule,
    GlobalModule,
  ],
  exports: [CustomActionFormatterComponent],
  entryComponents: [
    AssociateCableGatewayDialog,
    AssociatePeopleGatewayDialog,
    DeviceinfoComponent,
    DexcominfoGatewayDialog,
    CustomActionFormatterComponent,
    DeviceNetworkHistoryDialog,
    DeviceBatteryStatusHistoryDialog,
    IdhSessionHistoryDialog,
    DeviceAssociationLogsGatewayDialog,
    PatientAssociationLogsGatewayDialog,
    UserAssociationLogsGatewayDialog,
    AlertGatewayDialog,
    DeviceLastSeenHistoryDialog,
    SoftwareVersionHistoryDialog,
  ],
})
export class GatewayModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GatewayModule,
      providers: [],
    };
  }
}
