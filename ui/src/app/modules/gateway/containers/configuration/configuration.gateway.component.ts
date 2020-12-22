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
import { AssociateCableGatewayDialog } from "../../dialogs/associatecable/associatecable.gateway.dialog";
import { FlatTreeControl } from "@angular/cdk/tree";
import { SelectionModel } from "@angular/cdk/collections";
import { ConfigurationGatewayService } from "./configuration.gateway.sevice";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { CableModel } from "../../models/cable.model";
import { DriverModel } from "../../models/driver.model";
import { CableDriverMapModel } from "../../models/cabledrivermap.model";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
@Component({
  selector: "gateway-configuration",
  templateUrl: "./configuration.gateway.component.html",
  styleUrls: ["./configuration.gateway.component.scss"],
})
export class ConfigurationGatewayComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: ConfigurationGatewayService,
    private toastr_service: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  menu_list: Array<any> = [
    {
      link: "device",
      icon: "devices_other",
    },
    {
      link: "screen",
      icon: "content_copy",
    },
  ];
  ngOnInit() {}
}
