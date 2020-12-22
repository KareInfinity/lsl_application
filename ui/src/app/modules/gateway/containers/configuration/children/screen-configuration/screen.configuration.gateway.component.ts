import { Component, OnInit } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import {
  GridOption,
  Column,
  GridService,
  AngularGridInstance,
  Filters,
  FieldType,
  Formatters,
  OnEventArgs,
  BsDropDownService,
} from "angular-slickgrid";
import {
  MatDialog,
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from "@angular/material";
import { AssociateCableGatewayDialog } from "../../../../dialogs/associatecable/associatecable.gateway.dialog";
import { FlatTreeControl } from "@angular/cdk/tree";
import { SelectionModel } from "@angular/cdk/collections";
import { ScreenConfigurationGatewayService } from "./screen.configuration.gateway.sevice";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { CableModel } from "../../../../models/cable.model";
import { DriverModel } from "../../../../models/driver.model";
import { CableDriverMapModel } from "../../../../models/cabledrivermap.model";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { AppSettingsModel } from "src/app/modules/gateway/models/appsettings.model";
import { ReferenceListModel } from "src/app/modules/gateway/models/referencelist.model";
import { NgForm } from "@angular/forms";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
@Component({
  selector: "gateway-configuration-screen",
  templateUrl: "./screen.configuration.gateway.component.html",
  styleUrls: ["./screen.configuration.gateway.component.scss"],
})
export class ScreenConfigurationGatewayComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: ScreenConfigurationGatewayService,
    private toastr_service: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getData();
  }
  /* variables */
  is_loading = false;
  settings: AppSettingsModel = new AppSettingsModel();
  date_range_unit_list: Array<ReferenceListModel> = [
    new ReferenceListModel({
      ref_value_display_text: "Month",
      ref_value_code: "month",
    }),
    new ReferenceListModel({
      ref_value_display_text: "Day",
      ref_value_code: "day",
    }),
  ];
  getData() {
    this.is_loading = true;
    this.service
      .getAppSetting()
      .subscribe(
        (resp: ActionRes<AppSettingsModel>) => {
          this.settings = resp.item;
        },
        (error) => {
          var message = "Error getting data";
          if (_.has(error, "error.message")) {
            message = error.error.message;
          }
          this.toastr_service.error(message);
        }
      )
      .add(() => {
        this.is_loading = false;
      });
  }
  onSave(form: NgForm) {
    if (form.valid) {
      this.is_loading = true;
      var request = new ActionReq<AppSettingsModel>({
        item: this.settings,
      });
      this.service.saveAppSettings(request).subscribe(
        (resp: ActionRes<AppSettingsModel>) => {
          this.toastr_service.success("Saved Successfully");
        },
        (error) => {
          var message = "Error Saving settings";
          if (_.has(error, "error.message")) {
            message = error.error.message;
          }
          this.toastr_service.error(message);
        }
      );
    }
  }
}
