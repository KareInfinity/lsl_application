import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { DevicePeopleAssociationGatewayService } from "./devicepeopleassociation.service";
import { ToastrService } from "ngx-toastr";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
  OnEventArgs,
  Formatters,
} from "angular-slickgrid";
import { DevicePeopleModelCriteria } from "../../models/devicepeople.model";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { DeviceAssociationLogsGatewayDialog } from "../../dialogs/deviceassociationlogs/deviceassociationlogs.gateway.dialog";
import { PatientAssociationLogsGatewayDialog } from "../../dialogs/patientassociationlogs/patientassociationlogs.gateway.dialog";
import { UserAssociationLogsGatewayDialog } from "../../dialogs/userassociationlogs/userassociationlogs.gateway.dialog";
import { AssociatePeopleGatewayDialog } from "../../dialogs/associatepeople/associatepeople.gateway.dialog";
import { AlertGatewayDialog } from "../../dialogs/alert/alert.gateway.dialog";
import * as _ from "lodash";
@Component({
  selector: "gateway-devicepeopleassociation",
  templateUrl: "./devicepeopleassociation.component.html",
  styleUrls: ["./devicepeopleassociation.component.css"],
})
export class DevicePeopleAssociationGatewayComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: DevicePeopleAssociationGatewayService,
    private toastr_service: ToastrService
  ) {}
  ngOnInit() {
    this.getData();
    this.setupAssociationListGrid();
  }
  is_loading: boolean = false;
  show_history: boolean = false;
  /* slick grid */
  association_list_angular_grid: AngularGridInstance;
  association_list_grid: any;
  association_list_grid_service: GridService;
  association_list_grid_data_view: any;
  association_list_grid_column_definitions: Column[];
  association_list_grid_options: GridOption;
  association_list_grid_dataset: Array<DevicePeopleModelCriteria>;
  association_list_grid_updated_object: any;
  toggleHistoryView() {
    this.show_history = !this.show_history;
    this.getData();
  }
  getData() {
    this.is_loading = true;
    var request = new ActionReq<DevicePeopleModelCriteria>({
      item: new DevicePeopleModelCriteria({
        is_active: !this.show_history,
      }),
    });
    this.service
      .getAssociationList(request)
      .subscribe(
        (resp: ActionRes<Array<DevicePeopleModelCriteria>>) => {
          if (resp.item) {
            this.association_list_grid_dataset = resp.item;
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

  /* slick grid */
  associationListGridReady(angularGrid: AngularGridInstance) {
    this.association_list_angular_grid = angularGrid;
    this.association_list_grid_data_view = angularGrid.dataView;
    this.association_list_grid = angularGrid.slickGrid;
    this.association_list_grid_service = angularGrid.gridService;
  }
  async onAssociationListGridCellChanged(e, args) {
    this.association_list_grid_updated_object = args.item;
    // this.association_list_angular_grid.resizerService.resizeGrid(10);
  }
  setupAssociationListGrid() {
    this.association_list_grid_column_definitions = [
      {
        name: "",
        field: "",
        id: "",
        formatter: (row) => {
          if (this.show_history == false) {
            return `<span class="material-icons h5 text-danger">link_off</span>`;
          }
        },
        minWidth: 50,
        maxWidth: 50,
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          if (this.is_loading == false && this.show_history == false) {
            this.openDissociateAlert(args.dataContext);
          }
        },
      },
      {
        name: "",
        field: "id",
        id: "id",
        formatter: Formatters.infoIcon,
        minWidth: 50,
        //maxWidth: 50,
        onCellClick: this.showPeopleAssociationLogsPopup,
      },
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
        name: "",
        field: "id",
        id: "id",
        formatter: Formatters.infoIcon,
        minWidth: 50,
        //maxWidth: 50,
        onCellClick: this.showDeviceAssociationLogsPopup,
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
        name: "",
        field: "id",
        id: "id",
        formatter: Formatters.infoIcon,
        minWidth: 50,
        //maxWidth: 50,
        onCellClick: this.showUserAssociationLogsPopup,
      },
      // {
      //   id: "user_external_id",
      //   name: "User ID",
      //   field: "user_external_id",
      //   type: FieldType.string,
      //   sortable: true,
      //   minWidth: 200,
      //   //maxWidth: 220,
      //   filterable: true,
      //   filter: { model: Filters.compoundInput },
      // },
      {
        id: "user_fullname",
        name: "User name",
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
    this.association_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "association-list-grid-container",
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
  showDeviceAssociationLogsPopup = (e, args: OnEventArgs) => {
    const alert = this.dialog.open(DeviceAssociationLogsGatewayDialog, {
      height: "90vh",
      width: "90vw",
      data: {
        device_id: args.dataContext.device_id,
        device_name: args.dataContext.device_name,
        device_type: args.dataContext.device_type,
        serial_no: args.dataContext.device_serial_no,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
  showPeopleAssociationLogsPopup = (e, args: OnEventArgs) => {
    const alert = this.dialog.open(PatientAssociationLogsGatewayDialog, {
      height: "90vh",
      width: "90vw",
      data: {
        people_id: args.dataContext.people_id,
        people_fullname: args.dataContext.people_fullname,
        people_external_id: args.dataContext.people_external_id,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
  showUserAssociationLogsPopup = (e, args: OnEventArgs) => {
    const alert = this.dialog.open(UserAssociationLogsGatewayDialog, {
      height: "90vh",
      width: "90vw",
      data: {
        user_id: args.dataContext.user_id,
        user_fullname: args.dataContext.user_fullname,
        user_external_id: args.dataContext.user_external_id,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
  openAssociatePeopleDialog = (e, args: OnEventArgs) => {
    const alert = this.dialog.open(AssociatePeopleGatewayDialog, {
      // height: "90vh",
      // width: "90vw",
      data: {
        // user_id: args.dataContext.user_id,
        // user_fullname: args.dataContext.user_fullname,
        // user_external_id: args.dataContext.user_external_id,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
  openDissociateAlert = (device_people: DevicePeopleModelCriteria) => {
    const alert = this.dialog.open(AlertGatewayDialog, {
      // height: "90vh",
      // width: "90vw",
      data: {
        message: `Do you want to dissociate ${device_people.device_type} with serial no. ${device_people.device_serial_no} from person ${device_people.people_external_id}?`,
        // user_id: args.dataContext.user_id,
        // user_fullname: args.dataContext.user_fullname,
        // user_external_id: args.dataContext.user_external_id,
      },
    });
    alert.afterClosed().subscribe((resp) => {
      if (resp == true) {
        var request = new ActionReq<DevicePeopleModelCriteria>({
          item: device_people,
        });
        this.is_loading = true;
        this.service
          .dissociate(request)
          .subscribe(
            (resp) => {
              this.toastr_service.success("Dissociation Successfull");
              this.getData()
            },
            (err) => {
              var message = "Dissociation failed";
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
    });
  };
}
