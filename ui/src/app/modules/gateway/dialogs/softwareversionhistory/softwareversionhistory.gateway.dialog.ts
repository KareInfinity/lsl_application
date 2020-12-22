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
import {
  DeviceSoftwareVersion,
  DeviceSoftwareVersionCriteria,
} from "../../models/device.model";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { ActionRes } from "src/app/modules/global/models/actionres.model";

@Component({
  selector: "app-softwareversionhistory",
  templateUrl: "./softwareversionhistory.gateway.dialog.html",
  styleUrls: ["./softwareversionhistory.gateway.dialog.css"],
})
export class SoftwareVersionHistoryDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SoftwareVersionHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeviceSoftwareVersionCriteria,
    private service: SoftwareVersionHistoryService,
    private toastr_service: ToastrService
  ) {}
  ngOnInit() {
    this.setupDateFilter();
    this.getData();
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
  software_version_history_grid_dataset: Array<DeviceSoftwareVersionCriteria>;
  software_version_history_grid_updated_object: any;
  /* slick grid */

  /* variable */
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
  }
  getData() {
    this.is_loading = true;
    var post_data = new ActionReq<DeviceSoftwareVersionCriteria>({
      item: new DeviceSoftwareVersionCriteria({
        device_id: this.data.device_id,
        from_date: this.from_date,
        to_date: this.to_date,
      }),
    });
    this.service
      .getDeviceSoftwareVersion(post_data)
      .subscribe(
        (resp: ActionRes<Array<DeviceSoftwareVersionCriteria>>) => {
          this.software_version_history_grid_dataset = resp.item;
        },
        (err) => {
          var message = "Couldn't get date";
          if (_.has(err, "error.message")) {
            message = err.error.message;
          }
          this.toastr_service.error(message);
        }
      )
      .add(() => {
        this.is_loading = false;
      });
  }

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
        id: "created_on",
        name: "Date",
        field: "created_on",
        type: FieldType.date,
        sortable: true,
        minWidth: 150,
        formatter: Formatters.dateTimeIso,
      },

      {
        id: "people_external_id",
        name: "Created By",
        field: "people.external_id",
        type: FieldType.string,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: { model: Filters.input },
        formatter: Formatters.complexObject,
      },
      // {
      //   id: "people_fist_name",
      //   name: "People Name",
      //   field: "people.first_name",
      //   type: FieldType.string,
      //   minWidth: 100,
      //   sortable: true,
      //   filterable: true,
      //   filter: { model: Filters.input },
      //   formatter: Formatters.complexObject,
      // },
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
