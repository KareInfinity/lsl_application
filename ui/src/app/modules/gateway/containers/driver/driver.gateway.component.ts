import { Component, OnInit } from '@angular/core';
import { GridOption, Column, GridService, AngularGridInstance, FieldType, Filters, OnEventArgs } from 'angular-slickgrid';
import { DriverGatewayService } from './driver.gateway.service';
import { ToastrService } from 'ngx-toastr';
import { DriverModel } from '../../models/driver.model';
import { ActionReq } from 'src/app/modules/global/models/actionreq.model';
import * as moment from 'moment';
import * as _ from "lodash";

@Component({
  selector: 'gateway-driver',
  templateUrl: './driver.gateway.component.html',
  styleUrls: ['./driver.gateway.component.css']
})
export class DriverGatewayComponent implements OnInit {

  constructor(private driverService: DriverGatewayService,
    private toastr_service: ToastrService) { }

  ngOnInit() {
    this.drivers = new DriverModel();
    console.log("this.drivers", this.drivers);
    this.getData();
    this.setupDriverListGrid();
  }
  /* slick grid */
  driver_list_angular_grid: AngularGridInstance;
  driver_list_grid: any;
  driver_list_grid_service: GridService;
  driver_list_grid_data_view: any;
  driver_list_grid_column_definitions: Column[];
  driver_list_grid_options: GridOption;
  driver_list_grid_dataset: Array<DriverModel>;
  driver_list_grid_updated_object: any;
  /* slick grid */
  driverListGridReady(angularGrid: AngularGridInstance) {
    this.driver_list_angular_grid = angularGrid;
    this.driver_list_grid_data_view = angularGrid.dataView;
    this.driver_list_grid = angularGrid.slickGrid;
    this.driver_list_grid_service = angularGrid.gridService;
  }
  /* vairables */
  drivers: DriverModel | any;
  getData() {
    this.driverService.getDriverList().subscribe((resp: ActionReq<Array<DriverModel>>) => {
      if (resp.item) {
        console.log("resp.data", resp.item);
        this.driver_list_grid_dataset = resp.item;
      }
    }, (err) => {
      this.toastr_service.error("Error getting Drivers");
    })
  }
  setupDriverListGrid() {
    this.driver_list_grid_column_definitions = [
      {
        id: "",
        name: "",
        field: "",
        minWidth: 40,
        maxWidth: 40,
        formatter: (
          row,
          cell,
          value,
          columnDef,
          dataContext
        ) => {
          return `<i class="fa fa-pencil" style="color:blue;cursor:pointer;padding-left:30%" name="edit" aria-hidden="true"></i>`;
        },
        onCellClick: this.editDriver
      },
      // {
      //   name: "#",
      //   field: "id",
      //   id: "id",
      //   formatter: function (row) {
      //     return (row + 1).toString();
      //   },
      //   minWidth: 40,
      //   maxWidth: 40
      // },
      {
        id: "",
        name: "Code",
        field: "driver_code",
        type: FieldType.string,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "",
        name: "Name",
        field: "driver_name",
        type: FieldType.string,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "",
        name: "Purpose",
        field: "",
        type: FieldType.string,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput }
      },
      {
        id: "",
        name: "Defined On",
        field: "created_on",
        type: FieldType.string,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var last_seen_string = "";
          if (_.get(dataContext, "created_on", null) != null) {
            last_seen_string = moment(dataContext.created_on).format(
              "MM-DD-YYYY H:mm:ss"
            );
          }
          return last_seen_string;
        },
      },
      {
        id: "",
        name: "Modified On",
        field: "",
        type: FieldType.string,
        sortable: true,
        filter: { model: Filters.compoundInput },
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var last_seen_string = "";
          if (_.get(dataContext, "modified_on", null) != null) {
            last_seen_string = moment(dataContext.modified_on).format(
              "MM-DD-YYYY H:mm:ss"
            );
          }
          return last_seen_string;
        },
      }
    ];
    this.driver_list_grid_options = {
      asyncEditorLoading: false,
      autoResize: {
        containerId: "driver-list-grid-container",
        // sidePadding: 15,
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      // enableFiltering: true,
      enableGrouping: true,
    };
  }

  editDriver = (e, args: OnEventArgs) => {
    this.drivers = args.dataContext;
  }
  Clear = () => {
    this.drivers = new DriverModel();
  }
  Save = () => {
    var post_data = new ActionReq<DriverModel>({
      item: this.drivers
    });
    console.log("post_Data", post_data);
    this.driverService.saveDriver(post_data).subscribe((resp: any) => {
      console.log("Response Data", resp);
      if (resp.item) {
        this.toastr_service.success("Driver Add/Update successfully");
        this.getData();
      }
    }, (error) => {
      this.toastr_service.error("Error");
    })
  }
}
