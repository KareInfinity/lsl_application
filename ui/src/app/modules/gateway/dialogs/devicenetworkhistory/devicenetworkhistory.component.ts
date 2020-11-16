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
import { DeviceNetworkHistoryService } from "./devicenetworkhistory.service";
import { ToastrService } from "ngx-toastr";
import { DeviceValues } from "../../models/devicevalues.model";
import { DeviceNetworkValues } from "../../models/devicenetworkvalues.model";

@Component({
  selector: "app-devicenetworkhistory",
  templateUrl: "./devicenetworkhistory.component.html",
  styleUrls: ["./devicenetworkhistory.component.css"],
})
export class DeviceNetworkHistoryDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeviceNetworkHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: DeviceNetworkHistoryService,
    private toastr_service: ToastrService
  ) {}
  ngOnInit() {
    this.setupDateFilter();
    this.getData();
    this.setupDeviceNetworkHistoryGrid();
  }
  /* slick grid */
  device_network_history_list_angular_grid: AngularGridInstance;
  device_network_history_list_grid: any;
  device_network_history_list_grid_service: GridService;
  device_network_history_grid_data_view: any;
  device_network_history_grid_column_definitions: Column[];
  device_network_history_grid_options: GridOption;
  device_network_history_grid_dataset: any;
  device_network_history_grid_updated_object: any;
  /* slick grid */

  /* variable */
  is_loading: boolean = false;
  date_filter_list = [];
  date_filter: string = "";
  from_date: Date = new Date();
  to_date: Date = new Date();
  deviceNetworkHistoryGridReady(angularGrid: AngularGridInstance) {
    this.device_network_history_list_angular_grid = angularGrid;
    this.device_network_history_grid_data_view = angularGrid.dataView;
    this.device_network_history_list_grid = angularGrid.slickGrid;
    this.device_network_history_list_grid_service = angularGrid.gridService;
  }
  setupDateFilter() {
    this.date_filter_list = [
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
        break;
    }
    console.log("filter ", this.date_filter, this.from_date, this.to_date);
  }
  getData() {
    this.is_loading = true;
    var post_data = {
      item: {
        device_id: this.data.device_id,
        idh_session_id: this.data.idh_session_id,
      },
    };
    this.service
      .getDeviceNetworkValues(post_data, this.from_date, this.to_date)
      .subscribe(
        (resp: any) => {
          if (resp.item) {
            var device_network_history_list = _.map(resp.item, (v, k) => {
              v.id = k + 1;
              return new DeviceNetworkValues(v);
            });
            this.device_network_history_grid_dataset = device_network_history_list;
          }
        },
        (err) => {
          this.toastr_service.error(err.error.error.message);
        }
      )
      .add(() => {
        this.is_loading = false;
      });;
  }

  setupDeviceNetworkHistoryGrid() {
    this.device_network_history_grid_column_definitions = [
      // {
      //   name: "#",
      //   field: "",
      //   id: "id",
      //   formatter: function (row) {
      //     return (row + 1).toString();
      //   },
      //   minWidth: 30
      // },
      {
        id: "date",
        name: "Date",
        field: "created_on",
        type: FieldType.date,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.dateRange },
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var date_string = "";
          if (_.get(dataContext, "created_on", null) != null) {
            date_string = moment(dataContext.created_on).format(
              "MM-DD-YYYY H:mm:ss.SSS"
            );
          }
          return date_string;
        },
      },
      {
        id: "network_info",
        name: "Network Info",
        field: "network_info",
        type: FieldType.string,
        minWidth: 500,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
    ];
    this.device_network_history_grid_options = {
      asyncEditorLoading: false,
      autoHeight: false,
      autoResize: {
        containerId: "device-network-history-list-grid-container",
      },
      editable: true,
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
