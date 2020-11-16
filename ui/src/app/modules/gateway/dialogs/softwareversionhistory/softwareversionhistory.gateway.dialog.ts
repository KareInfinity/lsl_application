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
import { SoftwareVersionHistoryService } from "./softwareversionhistory.gateway.service";

@Component({
  selector: "app-softwareversionhistory",
  templateUrl: "./softwareversionhistory.gateway.dialog.html",
  styleUrls: ["./softwareversionhistory.gateway.dialog.css"],
})
export class SoftwareVersionHistoryDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SoftwareVersionHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: SoftwareVersionHistoryService,
    private toastr_service: ToastrService
  ) {}
  ngOnInit() {
    this.setupDateFilter();
    // this.getData();
    this.setupSoftwareVersionHistoryGrid();
  }
  is_loading: boolean = false;
  /* slick grid */
  software_version_history_list_angular_grid: AngularGridInstance;
  software_version_history_list_grid: any;
  software_version_history_list_grid_service: GridService;
  software_version_history_grid_data_view: any;
  software_version_history_grid_column_definitions: Column[];
  software_version_history_grid_options: GridOption;
  software_version_history_grid_dataset: any;
  software_version_history_grid_updated_object: any;
  /* slick grid */

  /* variable */
  loading = true;
  message = "Loading...";
  date_filter_list = [];
  date_filter: string = "";
  from_date: Date | null = null;
  to_date: Date | null = null;
  softwareVersionHistoryGridReady(angularGrid: AngularGridInstance) {
    this.software_version_history_list_angular_grid = angularGrid;
    this.software_version_history_grid_data_view = angularGrid.dataView;
    this.software_version_history_list_grid = angularGrid.slickGrid;
    this.software_version_history_list_grid_service = angularGrid.gridService;
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
  // getData() {
  //   this.is_loading = true;
  //   var post_data = new ActionReq<DeviceBatteryValuesCriteria>({
  //     item: new DeviceBatteryValuesCriteria({
  //       device_id: this.data.device_id,
  //       idh_session_id: this.data.idh_session_id,
  //       from_date: this.from_date,
  //       to_date: this.to_date,
  //     }),
  //   });
  //   console.log("Device Battery post data", post_data);
  //   this.service
  //     .getDeviceBatteryValues(post_data)
  //     .subscribe(
  //       (resp: any) => {
  //         if (resp.item) {
  //           var software_version_history_list = _.map(
  //             resp.item,
  //             (v, k) => {
  //               v.id = k + 1;
  //               return new DeviceBatteryValues(v);
  //             }
  //           );
  //           this.software_version_history_grid_dataset = software_version_history_list;
  //         }
  //       },
  //       (err) => {
  //         this.message = "Error";
  //         this.toastr_service.error(err.error.error.message);
  //       }
  //     )
  //     .add(() => {
  //       this.is_loading = false;
  //     });;
  // }

  setupSoftwareVersionHistoryGrid() {
    this.software_version_history_grid_column_definitions = [
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
        id: "association",
        name: "Association",
        field: "association",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "location",
        name: "Location",
        field: "location",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "software_version",
        name: "Software Version",
        field: "software_version",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.input },
      },
    ];
    this.software_version_history_grid_options = {
      asyncEditorLoading: false,
      autoHeight: false,
      autoResize: {
        containerId: "software_version-history-grid-container",
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
