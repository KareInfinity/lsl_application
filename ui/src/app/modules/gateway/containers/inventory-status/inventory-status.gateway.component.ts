import { Component, OnInit } from "@angular/core";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
  OnEventArgs,
  Formatters,
  GridOdataService,
  OdataOption,
} from "angular-slickgrid";
import { MatDialog } from "@angular/material";
import * as moment from "moment";
import * as _ from "lodash";
import { InventoryStatusGatewayService } from "./inventory-status.gateway.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryStatusModel } from "../../models/inventorystatus.model";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { AlertGatewayDialog } from "../../dialogs/alert/alert.gateway.dialog";

@Component({
  selector: "gateway-inventory-status",
  templateUrl: "./inventory-status.gateway.component.html",
  styleUrls: ["./inventory-status.gateway.component.scss"],
})
export class InventoryStatusGatewayComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: InventoryStatusGatewayService,
    private toastr_service: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.getData();
    this.setupInventoryStatusListGrid();
  }
  is_loading: boolean = false;
  /* slick grid */
  inventory_status_list_angular_grid: AngularGridInstance;
  inventory_status_list_grid: any;
  inventory_status_list_grid_service: GridService;
  inventory_status_list_grid_data_view: any;
  inventory_status_list_grid_column_definitions: Column[];
  inventory_status_list_grid_options: GridOption;
  inventory_status_list_grid_dataset: Array<InventoryStatusModel>;
  inventory_status_list_grid_updated_object: any;

  getData() {
    this.is_loading = true;
    var request = new ActionReq<InventoryStatusModel>({
      item: new InventoryStatusModel(),
    });
    this.service
      .getInventoryStatusList(request)
      .subscribe(
        (resp: ActionRes<Array<InventoryStatusModel>>) => {
          if (resp.item) {
            this.inventory_status_list_grid_dataset = resp.item;
          }
        },
        (err) => {
          this.toastr_service.error("Error getting InventoryStatus");
        }
      )
      .add(() => {
        this.is_loading = false;
      });
  }
  /* slick grid */
  inventoryStatusListGridReady(angularGrid: AngularGridInstance) {
    this.inventory_status_list_angular_grid = angularGrid;
    this.inventory_status_list_grid_data_view = angularGrid.dataView;
    this.inventory_status_list_grid = angularGrid.slickGrid;
    this.inventory_status_list_grid_service = angularGrid.gridService;
  }
  setupInventoryStatusListGrid() {
    this.inventory_status_list_grid_column_definitions = [
      {
        name: "",
        field: "",
        id: "",
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          if (dataContext.is_factory == false)
            return Formatters.editIcon(
              row,
              cell,
              value,
              columnDef,
              dataContext,
              grid
            );
        },
        minWidth: 50,
        maxWidth: 50,
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          if (args.dataContext.is_factory == false)
            this.gotoInventoryStatusMerge(args.dataContext.id);
        },
      },
      {
        name: "",
        field: "",
        id: "",
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          if (dataContext.is_factory == false)
            return Formatters.deleteIcon(
              row,
              cell,
              value,
              columnDef,
              dataContext,
              grid
            );
        },
        minWidth: 50,
        maxWidth: 50,
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          if (args.dataContext.is_factory == false)
            this.showDeleteInventoryStatusAlert(args.dataContext.id);
        },
      },
      {
        id: "inventory_status_text",
        name: "Name",
        field: "inventory_status_text",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "inventory_status_key",
        name: "Key",
        field: "inventory_status_key",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "is_factory",
        name: "Required",
        field: "is_factory",
        type: FieldType.boolean,
        sortable: true,
        minWidth: 120,
        // filterable: true,
        // filter: { model: Filters.input },
      },
      {
        id: "using_device_count",
        name: "Devices using status",
        field: "using_device_count",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        // filterable: true,
        // filter: { model: Filters.input },
      },
    ];
    this.inventory_status_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "inventory-status-list-grid-container",
        sidePadding: 15,
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableFiltering: true,
    };
  }
  gotoInventoryStatusMerge(id: number = 0) {
    if (id == 0) {
      this.router.navigate(["inventory-status-merge"], {
        relativeTo: this.route,
      });
    } else {
      this.router.navigate(["inventory-status-merge"], {
        relativeTo: this.route,
        queryParams: { id },
      });
    }
  }
  showDeleteInventoryStatusAlert(id: number) {
    const alert = this.dialog.open(AlertGatewayDialog, {
      data: {
        message: "Delete this inventory status?",
      },
    });
    alert.afterClosed().subscribe((resp) => {
      if (resp) {
        this.deleteInventoryStatus(id);
      }
    });
  }
  deleteInventoryStatus(id: number) {
    this.is_loading = true;
    var request = new ActionReq({
      item: new InventoryStatusModel({ id }),
    });
    this.service
      .deleteInventoryStatus(request)
      .subscribe(
        (resp: ActionRes<InventoryStatusModel>) => {
          this.toastr_service.success("Deleted successfully");
          this.getData();
        },
        (error) => {
          var message = "Error on deletion";
          if (_.has(error, "error.message")) {
            message = error.error.message;
          }
          this.toastr_service.error(message);
        }
      )
      .add(() => {
        this.is_loading = false;
      });
  }
}
