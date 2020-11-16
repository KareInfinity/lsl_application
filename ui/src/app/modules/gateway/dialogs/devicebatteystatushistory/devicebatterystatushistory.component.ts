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
import { DeviceBatteryStatusHistoryService } from "./devicebatterystatushistory.service";
import {
  DeviceBatteryValues,
  DeviceBatteryValuesCriteria,
} from "../../models/devicebatteryvalues.model";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";

@Component({
  selector: "app-devicebatterystatushistory",
  templateUrl: "./devicebatterystatushistory.component.html",
  styleUrls: ["./devicebatterystatushistory.component.css"],
})
export class DeviceBatteryStatusHistoryDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeviceBatteryStatusHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: DeviceBatteryStatusHistoryService,
    private toastr_service: ToastrService
  ) {}
  ngOnInit() {
    this.setupDateFilter();
    this.getData();
    this.setupDeviceBatteryStatusHistoryGrid();
  }
  is_loading: boolean = false;
  /* slick grid */
  device_battery_status_history_list_angular_grid: AngularGridInstance;
  device_battery_status_history_list_grid: any;
  device_battery_status_history_list_grid_service: GridService;
  device_battery_status_history_grid_data_view: any;
  device_battery_status_history_grid_column_definitions: Column[];
  device_battery_status_history_grid_options: GridOption;
  device_battery_status_history_grid_dataset: any;
  device_battery_status_history_grid_updated_object: any;
  /* slick grid */

  /* variable */
  loading = true;
  message = "Loading...";
  date_filter_list = [];
  date_filter: string = "";
  from_date: Date | null = null;
  to_date: Date | null = null;
  deviceBatteryStatusHistoryGridReady(angularGrid: AngularGridInstance) {
    this.device_battery_status_history_list_angular_grid = angularGrid;
    this.device_battery_status_history_grid_data_view = angularGrid.dataView;
    this.device_battery_status_history_list_grid = angularGrid.slickGrid;
    this.device_battery_status_history_list_grid_service =
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
        break;
    }
    console.log("filter ", this.date_filter, this.from_date, this.to_date);
  }
  getData() {
    this.is_loading = true;
    var post_data = new ActionReq<DeviceBatteryValuesCriteria>({
      item: new DeviceBatteryValuesCriteria({
        device_id: this.data.device_id,
        // idh_session_id: this.data.idh_session_id,
        from_date: this.from_date,
        to_date: this.to_date,
      }),
    });
    console.log("Device Battery post data", post_data);
    this.service
      .getDeviceBatteryValues(post_data)
      .subscribe(
        (resp: any) => {
          if (resp.item) {
            var device_battery_status_history_list = _.map(
              resp.item,
              (v, k) => {
                v.id = k + 1;
                return new DeviceBatteryValues(v);
              }
            );
            this.device_battery_status_history_grid_dataset = device_battery_status_history_list;
          }
        },
        (err) => {
          this.message = "Error";
          this.toastr_service.error(err.error.error.message);
        }
      )
      .add(() => {
        this.is_loading = false;
      });;
  }

  setupDeviceBatteryStatusHistoryGrid() {
    this.device_battery_status_history_grid_column_definitions = [
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
        field: "activation_date",
        type: FieldType.date,
        sortable: true,
        minWidth: 150,
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
          if (_.get(dataContext, "activation_date", null) != null) {
            date_string = moment(dataContext.activation_date).format(
              "MM-DD-YYYY H:mm:ss.SSS"
            );
          }
          return date_string;
        },
      },
      {
        id: "status",
        name: "Status",
        field: "status",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "warning",
        name: "Warning",
        field: "warning",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      /* { id: "activation_date", name: "activation_date", field: "activation_date", type: FieldType.string, minWidth: 100, sortable: true, filterable: true, filter: { model: Filters.compoundInput }, },
      { id: "expected_pm", name: "expected_pm", field: "expected_pm", type: FieldType.string, minWidth: 100, sortable: true, filterable: true, filter: { model: Filters.compoundInput }, }, */
      {
        id: "unique_id",
        name: "Unique ID",
        field: "unique_id",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "temperature",
        name: "Temperature",
        field: "temperature",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "serial_no",
        name: "Serial No",
        field: "serial_no",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "manufacturer_name",
        name: "Manufacturer Name",
        field: "manufacturer_name",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "manufactured_date",
        name: "Manufactured Date",
        field: "manufactured_date",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "current_energy",
        name: "Current Energy",
        field: "current_energy",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "energy_empty",
        name: "Energy Empty",
        field: "energy_empty",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "energy_designed_full",
        name: "Energy Designed Full",
        field: "energy_designed_full",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "energy_full",
        name: "Energy Full",
        field: "energy_full",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "charge_cycles_remaining",
        name: "Charge Cycles Remaining",
        field: "charge_cycles_remaining",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "charge_cycles_designed",
        name: "Charge Cycles Designed",
        field: "charge_cycles_designed",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "charge_cycles",
        name: "Charge Cycles",
        field: "charge_cycles",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "static_voltage",
        name: "Static Voltage",
        field: "static_voltage",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "dynamic_voltage",
        name: "Dynamic Voltage",
        field: "dynamic_voltage",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "resistance",
        name: "Resistance",
        field: "resistance",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "current_discharge_time",
        name: "Current Discharge Time",
        field: "current_discharge_time",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "capacity",
        name: "Battery",
        field: "capacity",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "technology",
        name: "Technology",
        field: "technology",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
    ];
    this.device_battery_status_history_grid_options = {
      asyncEditorLoading: false,
      autoHeight: false,
      autoResize: {
        containerId: "device-Battery-status-history-grid-container",
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
