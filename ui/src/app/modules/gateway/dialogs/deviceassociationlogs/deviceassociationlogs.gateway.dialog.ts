import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DeviceAssociationGatewayService } from "./deviceassociationlogs.gateway.service";
import { ToastrService } from "ngx-toastr";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
} from "angular-slickgrid";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { DevicePeopleModelCriteria } from "../../models/devicepeople.model";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
@Component({
  selector: "gateway-deviceassociationlogs-dialog",
  templateUrl: "./deviceassociationlogs.gateway.dialog.html",
  styleUrls: ["./deviceassociationlogs.gateway.dialog.css"],
})
export class DeviceAssociationLogsGatewayDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeviceAssociationLogsGatewayDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: DeviceAssociationGatewayService,
    private toastr_service: ToastrService
  ) {}
  is_loading: boolean = false;
  /* slick grid */
  association_angular_grid: AngularGridInstance;
  association_grid: any;
  association_grid_service: GridService;
  association_grid_data_view: any;
  association_grid_column_definitions: Column[];
  association_grid_options: GridOption;
  association_grid_dataset: Array<DevicePeopleModelCriteria>;
  association_grid_updated_object: any;
  /* slick grid */
  deviceAssociationListGridReady(angularGrid: AngularGridInstance) {
    this.association_angular_grid = angularGrid;
    this.association_grid_data_view = angularGrid.dataView;
    this.association_grid = angularGrid.slickGrid;
    this.association_grid_service = angularGrid.gridService;
  }
  /* variable */
  loading = true;
  message = "Loading...";
  date_filter_list = [];
  date_filter: string = "";
  from_date: Date = new Date();
  to_date: Date = new Date();
  ngOnInit() {
    this.getData();
    this.setupDeviceInfoListGrid();
  }

  getData() {
    this.is_loading = true;
    var request = new ActionReq<DevicePeopleModelCriteria>({
      item: new DevicePeopleModelCriteria({
        device_id: this.data.device_id,
      }),
    });
    this.service
      .getAssociationList(request)
      .subscribe(
        (resp: ActionRes<Array<DevicePeopleModelCriteria>>) => {
          if (resp.item) {
            this.association_grid_dataset = resp.item;
          }
        },
        (err) => {
          this.toastr_service.error("Error getting Association");
        }
      )
      .add(() => {
        this.is_loading = false;
      });;
  }

  setupDeviceInfoListGrid() {
    this.association_grid_column_definitions = [
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
        id: "people_external_id",
        name: "People ID",
        field: "people_external_id",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "people_fullname",
        name: "People Fullname",
        field: "people_fullname",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "user_external_id",
        name: "User ID",
        field: "user_external_id",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "user_fullname",
        name: "User Fullname",
        field: "user_fullname",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "request_status",
        name: "Request Status",
        field: "request_status",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "valid_from",
        name: "Valid From",
        field: "valid_from",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "valid_to",
        name: "Valid To",
        field: "valid_to",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
    ];
    this.association_grid_options = {
      asyncEditorLoading: false,
      autoHeight: false,
      autoResize: {
        containerId: "device-association-grid-container",
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
