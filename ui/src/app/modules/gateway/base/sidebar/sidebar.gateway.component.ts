import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import { MatDialog } from "@angular/material";
import { StorageAuthService } from "src/app/modules/auth/service/storage/storage.auth.service";
import { ApiAuthService } from 'src/app/modules/auth/service/api/api.auth.service';
import { Settings } from 'src/app/modules/global/models/settings.model';
import { StorageGlobalService } from 'src/app/modules/global/service/storage/storage.global.service';
import { PeopleModel } from '../../models/people.model';

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
  people: PeopleModel = new PeopleModel();
  settings: Settings = new Settings();
  menu_list: Array<any> = [
    {
      link: "master",
      label: "Master",
    },
    // {
    //   link: "active",
    //   label: "Active",
    // },
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
    this.people = this.auth_storage.people;
    this.settings = this.global_storage.settings;
  }
  logout() {
    this.auth_service.logout();
  }
}
