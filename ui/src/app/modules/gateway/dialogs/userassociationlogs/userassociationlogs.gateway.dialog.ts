import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UserAssociationGatewayService } from "./userassociationlogs.gateway.service";
import { ToastrService } from "ngx-toastr";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
} from "angular-slickgrid";
import {
  DevicePeopleModel,
  DevicePeopleModelCriteria,
} from "../../models/devicepeople.model";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { PeopleModel } from "../../models/people.model";
@Component({
  selector: "gateway-userassociationlogs-dialog",
  templateUrl: "./userassociationlogs.gateway.dialog.html",
  styleUrls: ["./userassociationlogs.gateway.dialog.css"],
})
export class UserAssociationLogsGatewayDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UserAssociationLogsGatewayDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PeopleModel,
    private service: UserAssociationGatewayService,
    private toastr_service: ToastrService
  ) {}
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
  associationListGridReady(angularGrid: AngularGridInstance) {
    this.association_angular_grid = angularGrid;
    this.association_grid_data_view = angularGrid.dataView;
    this.association_grid = angularGrid.slickGrid;
    this.association_grid_service = angularGrid.gridService;
  }
  /* variable */
  is_loading: boolean = false;
  date_filter_list = [];
  date_filter: string = "";
  from_date: Date = new Date();
  to_date: Date = new Date();
  ngOnInit() {
    this.getData();
    this.setupUserInfoListGrid();
  }

  getData() {
    this.is_loading = true;
    var request = new ActionReq<DevicePeopleModelCriteria>({
      item: new DevicePeopleModelCriteria({
        user_id: this.data.id,
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
      });
  }

  setupUserInfoListGrid() {
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
        id: "device_serial_no",
        name: "Device Serial No.",
        field: "device_serial_no",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "device_name",
        name: "Device Name",
        field: "device_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "device_type",
        name: "Device Type",
        field: "device_type",
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
        containerId: "association-grid-container",
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
