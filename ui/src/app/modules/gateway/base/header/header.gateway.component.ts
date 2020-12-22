import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import * as JWT from "jwt-decode";
import { ApiAuthService } from "src/app/modules/auth/service/api/api.auth.service";
import { StorageAuthService } from "src/app/modules/auth/service/storage/storage.auth.service";
import { Settings } from "src/app/modules/global/models/settings.model";
import { StorageGlobalService } from "src/app/modules/global/service/storage/storage.global.service";
import { ProfileGatewayDialog } from "../../dialogs/profile/profile.gateway.dialog";
import { DeviceModel } from "../../models/device.model";
import { InventoryStatusModel } from "../../models/inventorystatus.model";
import { PeopleModel } from "../../models/people.model";

@Component({
  selector: "gateway-header",
  templateUrl: "./header.gateway.component.html",
  styleUrls: ["./header.gateway.component.scss"],
})
export class HeaderGatewayComponent implements OnInit {
  name = "";
  constructor(
    private auth_storage: StorageAuthService,
    private auth_service: ApiAuthService,
    private global_storage: StorageGlobalService,
    private dialog: MatDialog,
    private router: Router
  ) {}
  people: PeopleModel = new PeopleModel();
  settings: Settings = new Settings();
  menu_list: Array<any> = [
    {
      link: "devices",
      label: "Devices",
    },
    {
      link: "people",
      label: "People",
    },
    {
      link: "inventorystatus",
      label: "Inventory Status",
    },
    // {
    //   link: "active",
    //   label: "Active",
    // },
    {
      link: "configuration",
      label: "Configuration",
    },
    {
      link: "notificationviewer",
      label: "Logs",
    },
  ];
  ngOnInit() {
    this.people = this.auth_storage.people;
    this.settings = this.global_storage.settings;
  }
  public FactoryStatuses = InventoryStatusModel.FactoryStatuses;
  logout() {
    this.auth_service.logout();
  }
  showProfilePopup = () => {
    const alert = this.dialog.open(ProfileGatewayDialog, {
      maxHeight: "90vh",
      width: "30vw",
      // data: args.dataContext,
      data: {},
    });
    alert.afterClosed().subscribe(() => {});
  };
  goToDevices(type: string = "") {
    switch (type) {
      case InventoryStatusModel.FactoryStatuses.active:
        this.router.navigateByUrl(
          `/lifeshield/devices?inventory_status_key=${InventoryStatusModel.FactoryStatuses.active}`
        );
        break;
      case InventoryStatusModel.FactoryStatuses.unrecognised_device:
        this.router.navigateByUrl(
          `/lifeshield/devices?inventory_status_key=${InventoryStatusModel.FactoryStatuses.unrecognised_device}`
        );
        break;
      default:
        this.router.navigateByUrl(`/lifeshield/devices`);
        break;
    }
  }
}
