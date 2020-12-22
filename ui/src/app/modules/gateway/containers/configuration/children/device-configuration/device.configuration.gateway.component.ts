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
import { DeviceConfigurationGatewayService } from "./device.configuration.gateway.sevice";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { CableModel } from "../../../../models/cable.model";
import { DriverModel } from "../../../../models/driver.model";
import { CableDriverMapModel } from "../../../../models/cabledrivermap.model";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
@Component({
  selector: "gateway-configuration-device",
  templateUrl: "./device.configuration.gateway.component.html",
  styleUrls: ["./device.configuration.gateway.component.scss"],
})
export class DeviceConfigurationGatewayComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: DeviceConfigurationGatewayService,
    private toastr_service: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getData();
    this.setupCableListGrid();
  }
  /* variables */
  is_loading = false;
  selected_device = null;
  driver_list: any;
  enabled_device_list = [
    // {
    //   id: 1,
    //   feature_name: "DexCom",
    // },
  ];

  /* slick grid */
  cable_driver_map_list_angular_grid: AngularGridInstance;
  cable_driver_map_list_grid: any;
  cable_driver_map_list_grid_service: GridService;
  cable_driver_map_list_grid_data_view: any;
  cable_driver_map_list_grid_column_definitions: Column[];
  cable_driver_map_list_grid_options: GridOption;
  cable_driver_map_list_grid_dataset: Array<any> = [];
  cable_driver_map_list_grid_updated_object: any;

  getData() {
    this.is_loading = true;
    forkJoin([
      this.service.getDeviceList(),
      this.service.getCableDriverMapList(),
    ])
      .subscribe(
        (resp_arr: Array<any>) => {
          if (_.has(resp_arr, "0.item.0")) {
            this.enabled_device_list = resp_arr[0].item;
          }
          if (_.has(resp_arr, "1.item.0")) {
            this.cable_driver_map_list_grid_dataset = resp_arr[1].item;
          }
        },
        (error) => {
          var message = "Couldn't get data";
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

  openAssociateCableDialog(): void {
    const dialogRef = this.dialog.open(AssociateCableGatewayDialog, {
      width: "20vw",
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getData();
      }
    });
  }

  selectDevice(device) {
    if (this.selected_device == device) {
      this.selected_device = null;
    } else {
      this.selected_device = device;
    }
  }

  /* slick grid */
  cableDriverMapList(angularGrid: AngularGridInstance) {
    this.cable_driver_map_list_angular_grid = angularGrid;
    this.cable_driver_map_list_grid_data_view = angularGrid.dataView;
    this.cable_driver_map_list_grid = angularGrid.slickGrid;
    this.cable_driver_map_list_grid_service = angularGrid.gridService;
  }
  setupCableListGrid() {
    this.cable_driver_map_list_grid_column_definitions = [
      // {
      //   name: "#",
      //   field: "id",
      //   id: "id",
      //   formatter: function (row) {
      //     return (row + 1).toString();
      //   },
      //   minWidth: 50,
      //   maxWidth: 50,
      // },
      {
        id: "unique_identifier",
        name: "Unique Identifier",
        field: "cable_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "security_key",
        name: "Security Key",
        field: "security_key",
        type: FieldType.string,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "registered_date",
        name: "Registered Date",
        field: "created_on",
        type: FieldType.string,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "last_used_date",
        name: "Last Used Date",
        field: "modified_on",
        type: FieldType.string,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
    ];
    this.cable_driver_map_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "cable-driver-map-list-grid-container",
        sidePadding: 15,
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableFiltering: true,
      //   checkboxSelector: {
      //     // you can toggle these 2 properties to show the "select all" checkbox in different location
      //     hideInFilterHeaderRow: false,
      //     hideInColumnTitleRow: true,
      //   },
      //   rowSelectionOptions: {
      //     // True (Single Selection), False (Multiple Selections)
      //     selectActiveRow: false,
      //   },
      //   enableCheckboxSelector: true,
      //   enableRowSelection: true,
    };
  }

  gotoImportCables() {
    this.router.navigate(["import-cables"], {
      relativeTo: this.route.parent,
    });
  }
}
