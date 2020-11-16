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
import { IdhSessionHistoryService } from "./idhsessionhistory.service";
import {
  IDHSessionsModel,
  IDHSessionsModelCriteria,
} from "../../models/idhsessions.model";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";

@Component({
  selector: "app-idhsessionhistory",
  templateUrl: "./idhsessionhistory.dialog.html",
  styleUrls: ["./idhsessionhistory.dialog.css"],
})
export class IdhSessionHistoryDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<IdhSessionHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: IdhSessionHistoryService,
    private toastr_service: ToastrService
  ) {}
  is_loading: boolean = false;
  /* slick grid */
  idh_session_history_angular_grid: AngularGridInstance;
  idh_session_history_grid: any;
  idh_session_history_grid_service: GridService;
  idh_session_history_grid_data_view: any;
  idh_session_history_grid_column_definitions: Column[];
  idh_session_history_grid_options: GridOption;
  idh_session_history_grid_dataset: Array<IDHSessionsModel>;
  idh_session_history_grid_updated_object: any;
  /* slick grid */
  idhSessionHistoryListGridReady(angularGrid: AngularGridInstance) {
    this.idh_session_history_angular_grid = angularGrid;
    this.idh_session_history_grid_data_view = angularGrid.dataView;
    this.idh_session_history_grid = angularGrid.slickGrid;
    this.idh_session_history_grid_service = angularGrid.gridService;
  }
  /* variable */
  loading = true;
  message = "Loading...";
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
    var post_data = new ActionReq<IDHSessionsModelCriteria>({
      item: new IDHSessionsModelCriteria({
        device_id: this.data.device_id,
        from_date: this.from_date,
        to_date: this.to_date,
      }),
    });
    this.service
      .getIdhSessionList(post_data)
      .subscribe(
        (resp: any) => {
          if (resp.item) {
            console.log("IDH Session History:", resp.item);
            var idh_session_history = _.map(resp.item, (v, k) => {
              v.id = k + 1;
              return new IDHSessionsModel(v);
            });
            this.loading = false;
            this.idh_session_history_grid_dataset = idh_session_history;
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

  setupDeviceInfoListGrid() {
    this.idh_session_history_grid_column_definitions = [
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
        id: "id",
        name: "Duration",
        field: "id",
        type: FieldType.date,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.dateRange },
        formatter: (row, cell, value, columnDef, dataContext) => {
          var duration = moment.duration(
            moment(dataContext.session_end).diff(
              moment(dataContext.session_start)
            )
          );
          var days = duration.days();
          duration.subtract(moment.duration(days, "days"));

          //Get hours and subtract from duration
          var hours = duration.hours();
          duration.subtract(moment.duration(hours, "hours"));

          //Get Minutes and subtract from duration
          var minutes = duration.minutes();
          duration.subtract(moment.duration(minutes, "minutes"));

          return `${days} day${days > 1 ? "s" : ""} ${hours} hour${
            hours > 1 ? "s" : ""
          } ${minutes} min${minutes > 1 ? "s" : ""}`;
        },
      },
      {
        id: "session_start",
        name: "Session Start",
        field: "session_start",
        type: FieldType.date,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.dateRange },
        formatter: Formatters.dateTimeIso,
      },
      {
        id: "session_end",
        name: "Session End",
        field: "session_end",
        type: FieldType.date,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.dateRange },
        formatter: Formatters.dateTimeIso,
      },
      {
        id: "session_guid",
        name: "Session GUID",
        field: "session_guid",
        type: FieldType.string,
        sortable: true,
        minWidth: 100,
        filterable: true,
      },
    ];
    this.idh_session_history_grid_options = {
      asyncEditorLoading: false,
      autoHeight: false,
      autoResize: {
        containerId: "idh-session-history-grid-container",
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
