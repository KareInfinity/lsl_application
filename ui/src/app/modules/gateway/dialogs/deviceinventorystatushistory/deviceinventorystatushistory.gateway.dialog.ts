import { Component, OnInit, Inject } from "@angular/core";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
  Formatters,
} from "angular-slickgrid";
import * as moment from "moment";
import * as _ from "lodash";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { DeviceValues } from "../../models/devicevalues.model";
import { DeviceInventoryStatusHistoryService } from "./deviceinventorystatushistory.gateway.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import {
  DeviceInventoryStatusModel,
  DeviceInventoryStatusModelCriteria,
} from "../../models/inventorystatus.model";
import { DeviceModel } from "../../models/device.model";

@Component({
  selector: "app-deviceinventorystatushistory",
  templateUrl: "./deviceinventorystatushistory.gateway.dialog.html",
  styleUrls: ["./deviceinventorystatushistory.gateway.dialog.css"],
})
export class DeviceInventoryStatusHistoryDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeviceInventoryStatusHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeviceModel,
    private service: DeviceInventoryStatusHistoryService,
    private toastr_service: ToastrService
  ) {}
  ngOnInit() {
    this.setupDateFilter();
    this.getData();
    this.setupDeviceInventoryStatusHistoryGrid();
  }
  is_loading: boolean = false;
  /* slick grid */
  device_inventory_status_history_list_angular_grid: AngularGridInstance;
  device_inventory_status_history_list_grid: any;
  device_inventory_status_history_list_grid_service: GridService;
  device_inventory_status_history_grid_data_view: any;
  device_inventory_status_history_grid_column_definitions: Column[];
  device_inventory_status_history_grid_options: GridOption;
  device_inventory_status_history_grid_dataset: any;
  device_inventory_status_history_grid_updated_object: any;
  /* slick grid */

  /* variable */
  date_filter_list = [];
  date_filter: string = "";
  from_date: Date | null = null;
  to_date: Date | null = null;
  deviceInventoryStatusHistoryGridReady(angularGrid: AngularGridInstance) {
    this.device_inventory_status_history_list_angular_grid = angularGrid;
    this.device_inventory_status_history_grid_data_view = angularGrid.dataView;
    this.device_inventory_status_history_list_grid = angularGrid.slickGrid;
    this.device_inventory_status_history_list_grid_service =
      angularGrid.gridService;
  }
  setupDateFilter() {
    this.date_filter_list = [
      { name: "Default", key: "DEFAULT" },
      { name: "Last 5 minutes", key: "LAST_5_MINS" },
      { name: "Last 30 minutes", key: "LAST_30_MINS" },
      { name: "Custom", key: "CUSTOM" },
    ];
    this.onDateFilterChanged();
  }
  onDateFilterChanged() {
    var default_filter: string = this.date_filter_list[0].key;

    if (this.date_filter == "") {
      this.date_filter = default_filter;
    }

    switch (this.date_filter) {
      case "LAST_5_MINS":
        this.from_date = moment().subtract("minute", 5).toDate();
        this.to_date = moment().toDate();
        break;
      case "LAST_30_MINS":
        this.from_date = moment().subtract("minute", 30).toDate();
        this.to_date = moment().toDate();
        break;
      default:
        this.from_date = null;
        this.to_date = null;
        break;
    }
    console.log("filter ", this.date_filter, this.from_date, this.to_date);
  }
  getData() {
    this.is_loading = true;
    var post_data = new ActionReq<DeviceInventoryStatusModelCriteria>({
      item: new DeviceInventoryStatusModelCriteria({
        device_id: this.data.id,
        from_date: this.from_date,
        to_date: this.to_date,
      }),
    });
    console.log("Device Battery post data", post_data);
    this.service
      .getDeviceInventoryStatus(post_data)
      .subscribe(
        (resp: any) => {
          this.device_inventory_status_history_grid_dataset = resp.item;
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

  setupDeviceInventoryStatusHistoryGrid() {
    this.device_inventory_status_history_grid_column_definitions = [
      // {
      //   name: "#",
      //   field: "",
      //   id: "id",
      //   formatter: function (row) {
      //     return (row + 1).toString();
      //   },
      //   minWidth: 30,
      //   maxWidth: 30,
      // },
      {
        id: "date",
        name: "Date",
        field: "created_on",
        type: FieldType.date,
        sortable: true,
        minWidth: 150,
        // filterable: true,
        // filter: { model: Filters.dateRange },
        formatter: Formatters.dateTimeIso,
        // formatter: (
        //   row: number,
        //   cell: number,
        //   value: any,
        //   columnDef: Column,
        //   dataContext: any,
        //   grid?: any
        // ) => {
        //   var date_string = "";
        //   if (_.get(dataContext, "activation_date", null) != null) {
        //     date_string = moment(dataContext.activation_date).format(
        //       "MM-DD-YYYY H:mm:ss.SSS"
        //     );
        //   }
        //   return date_string;
        // },
      },
      {
        id: "inventory_status",
        name: "Inventory Status",
        field: "inventory_status",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.input },
      },
      // {
      //   id: "location",
      //   name: "Location",
      //   field: "location",
      //   type: FieldType.string,
      //   minWidth: 100,
      //   sortable: true,
      //   filterable: true,
      //   filter: { model: Filters.input },
      // },
      // {
      //   id: "software_version",
      //   name: "Software Version",
      //   field: "software_version",
      //   type: FieldType.string,
      //   minWidth: 100,
      //   sortable: true,
      //   filterable: true,
      //   filter: { model: Filters.input },
      // },
    ];
    this.device_inventory_status_history_grid_options = {
      asyncEditorLoading: false,
      autoHeight: false,
      autoResize: {
        containerId: "device-inventory-status-history-grid-container",
      },
      editable: false,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableGrouping: true,
      enableFiltering: true,
    };
  }

  close() {
    this.dialogRef.close();
  }
}
