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
import { DeviceinfoService } from "./deviceinfo.service";
import { ToastrService } from "ngx-toastr";
import {
  DeviceValues,
  CustomDeviceValues,
} from "../../models/devicevalues.model";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";

@Component({
  selector: "app-deviceinfo",
  templateUrl: "./deviceinfo.component.html",
  styleUrls: ["./deviceinfo.component.css"],
})
export class DeviceinfoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeviceinfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deviceInfoService: DeviceinfoService,
    private toastr_service: ToastrService
  ) {}
  is_loading: boolean = false;
  /* slick grid */
  device_info_list_angular_grid: AngularGridInstance;
  device_info_list_grid: any;
  device_info_list_grid_service: GridService;
  device_info_grid_data_view: any;
  device_info_grid_column_definitions: Column[];
  device_info_grid_options: GridOption;
  device_info_grid_dataset: any;
  device_info_grid_updated_object: any;
  /* slick grid */
  deviceInfoListGridReady(angularGrid: AngularGridInstance) {
    this.device_info_list_angular_grid = angularGrid;
    this.device_info_grid_data_view = angularGrid.dataView;
    this.device_info_list_grid = angularGrid.slickGrid;
    this.device_info_list_grid_service = angularGrid.gridService;
  }
  /* variable */
  date_filter_list = [];
  date_filter: string = "";
  from_date: Date | null = null;
  to_date: Date | null = null;
  ngOnInit() {
    this.setupDateFilter();
    this.getData();
    this.setupDeviceInfoListGrid();
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
    var post_data = new ActionReq<CustomDeviceValues>({
      item: new CustomDeviceValues({
        device_id: this.data.device_id,
        idh_session_id: this.data.idh_session_id,
        from_date: this.from_date,
        to_date: this.to_date,
      }),
    });
    this.deviceInfoService
      .getDeviceValues(post_data)
      .subscribe(
        (resp: any) => {
          if (resp.item) {
            var device_info_list = _.map(resp.item, (v, k) => {
              v.id = k + 1;
              return new CustomDeviceValues(v);
            });
            this.device_info_grid_dataset = device_info_list;
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

  setupDeviceInfoListGrid() {
    this.device_info_grid_column_definitions = [
      // {
      //   name: "#",
      //   field: "",
      //   id: "id",
      //   formatter: function (row) {
      //     return (row + 1).toString();
      //   },
      //   minWidth: 30,
      //   maxWidth: 50,
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
        id: "message_direction",
        name: "Direction",
        field: "message_direction",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "hl7_version",
        name: "Message Version",
        field: "hl7_version",
        type: FieldType.string,
        minWidth: 40,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "device_event",
        name: "Event",
        field: "device_event",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "raw_value",
        name: "Value",
        field: "raw_value",
        type: FieldType.string,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },

      {
        id: "raw_value_uom",
        name: "UOM",
        field: "raw_value_uom",
        type: FieldType.string,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
    ];
    this.device_info_grid_options = {
      asyncEditorLoading: false,
      autoHeight: false,
      autoResize: {
        containerId: "device-info-list-grid-container",
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
