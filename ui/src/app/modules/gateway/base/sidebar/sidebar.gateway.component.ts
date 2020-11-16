import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { MatDialog } from "@angular/material";
import { StorageAuthService } from "src/app/modules/auth/service/storage/storage.auth.service";
import { User } from 'src/app/modules/auth/models/user.model';
import { ApiAuthService } from 'src/app/modules/auth/service/api/api.auth.service';
import { Settings } from 'src/app/modules/global/models/settings.model';
import { StorageGlobalService } from 'src/app/modules/global/service/storage/storage.global.service';

@Component({
  selector: "gateway-sidebar",
  templateUrl: "./sidebar.gateway.component.html",
  styleUrls: ["./sidebar.gateway.component.scss"],
})
export class SidebarGatewayComponent implements OnInit {
  constructor(
    private auth_storage: StorageAuthService,
    private auth_service: ApiAuthService,
    private global_storage: StorageGlobalService
  ) {}
  user: User = new User();
  settings: Settings = new Settings();
  menu_list: Array<any> = [
    {
      link: "master",
      label: "Master",
    },
    {
      link: "active",
      label: "Active",
    },
    {
      link: "configuration",
      label: "Licences",
    },
    {
      link: "notificationviewer",
      label: "Notification Viewer",
    },
  ];
  ngOnInit() {
    this.user = this.auth_storage.user;
    this.settings = this.global_storage.settings;
  }
  logout() {
    this.auth_service.logout();
  }
}
