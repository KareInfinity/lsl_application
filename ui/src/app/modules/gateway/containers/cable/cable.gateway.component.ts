import { Component, OnInit } from '@angular/core';
import { AngularGridInstance, GridService, Column, GridOption, FieldType, Filters, OnEventArgs } from 'angular-slickgrid';
import { CableGatewayService } from './cable.gateway.service';
import { ToastrService } from 'ngx-toastr';
import { ActionRes } from 'src/app/modules/global/models/actionres.model';
import { CableModel } from '../../models/cable.model';
import { ActionReq } from 'src/app/modules/global/models/actionreq.model';
import * as moment from 'moment';
import * as _ from "lodash";

@Component({
  selector: 'gateway-cable',
  templateUrl: './cable.gateway.component.html',
  styleUrls: ['./cable.gateway.component.css']
})
export class CableGatewayComponent implements OnInit {

  constructor(private cableService: CableGatewayService,
    private toastr_service: ToastrService) { }

  ngOnInit() {
    this.getData();
    this.setupCableListGrid();
  }
  /* slick grid */
  cable_list_angular_grid: AngularGridInstance;
  cable_list_grid: any;
  cable_list_grid_service: GridService;
  cable_list_grid_data_view: any;
  cable_list_grid_column_definitions: Column[];
  cable_list_grid_options: GridOption;
  cable_list_grid_dataset: Array<CableModel>;
  cable_list_grid_updated_object: any;
  /* slick grid */
  cableListGridReady(angularGrid: AngularGridInstance) {
    this.cable_list_angular_grid = angularGrid;
    this.cable_list_grid_data_view = angularGrid.dataView;
    this.cable_list_grid = angularGrid.slickGrid;
    this.cable_list_grid_service = angularGrid.gridService;
  }
  /* variables */
  cable: CableModel | any;

  getData() {
    this.cable = new CableModel();
    this.cableService.getCableList().subscribe((resp: any) => {
      if (resp.item) {
        var data = _.forEach(resp.item, (v, k) => {
          v.id = k;
        })
        console.log("get data", data);
        this.cable_list_grid_dataset = data;
      }
    }, (err) => {
      this.toastr_service.error("Error getting Cables");
    })
  }

  setupCableListGrid() {
    this.cable_list_grid_column_definitions = [
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
        onCellClick: this.editCable
      },
      // {
      //   name: "#",
      //   field: "",
      //   id: "",
      //   formatter: function (row) {
      //     return (row + 1).toString();
      //   },
      //   minWidth: 50,
      //   maxWidth: 50
      // },
      {
        id: "",
        name: "Name",
        field: "cable_name",
        type: FieldType.string,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundInput },
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
        field: "modified_on",
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
    this.cable_list_grid_options = {
      asyncEditorLoading: false,
      autoResize: {
        containerId: "cable-list-grid-container",
        // sidePadding: 15,
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      // enableFiltering: true,
      enableGrouping: true,
    };
  }
  editCable = (e, args: OnEventArgs) => {
    this.cable = args.dataContext;
  }
  clear = () => {
    this.cable = new CableModel();
  }
  save = () => {
    var post_data = new ActionReq<CableModel>({
      item: this.cable
    })
    console.log("post_data", post_data);
    this.cableService.saveCable(post_data).subscribe((resp: any) => {
      if (resp.item) {
        this.toastr_service.success("save/update successfully");
        this.getData();
      }
    }, (error) => {
      this.toastr_service.error("Error");
    })
  }
}
