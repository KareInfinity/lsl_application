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
  OperatorType,
} from "angular-slickgrid";
import { ToastrService } from "ngx-toastr";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import * as moment from "moment";
import * as _ from "lodash";
import { DeviceMasterService } from "./device_master.gateway.service";
import {
  DeviceModel,
  DeviceModelCriteria,
  DeviceSoftwareVersionCriteria,
} from "../../models/device.model";
import { Router, ActivatedRoute } from "@angular/router";
import { Action } from "rxjs/internal/scheduler/Action";
import { DevicePeopleModelCriteria } from "../../models/devicepeople.model";
import { DeviceDatasetModel } from "./models/devicedataset.model";
import { MatDialog } from "@angular/material";
import { DeviceLastSeenHistoryDialog } from "../../dialogs/devicelastseenhistory/devicelastseenhistory.gateway.dialog";
import { SoftwareVersionHistoryDialog } from "../../dialogs/softwareversionhistory/softwareversionhistory.gateway.dialog";
import { DeviceBatteryStatusHistoryDialog } from "../../dialogs/devicebatteystatushistory/devicebatterystatushistory.component";
import { dBmToPercentageService } from "../../utils/dbmtopercentage.utils";
import { DeviceNetworkHistoryDialog } from "../../dialogs/devicenetworkhistory/devicenetworkhistory.component";
import { InventoryStatusModel } from "../../models/inventorystatus.model";
import { map } from "rxjs/operators";
import { DeviceinfoComponent } from "../../dialogs/deviceinfo/deviceinfo.component";
@Component({
  selector: "gateway-devicemaster",
  templateUrl: "./device_master.gateway.component.html",
  styleUrls: ["./device_master.gateway.component.css"],
})
export class DeviceMasterGatewayComponent implements OnInit {
  constructor(
    private deviceMasterService: DeviceMasterService,
    private toastr_service: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private dBmToPercentageService: dBmToPercentageService,
    private activated_route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activated_route.queryParams.subscribe((params) => {
      if (_.has(params, "inventory_status_key")) {
        this.device.inventory_status.inventory_status_key =
          params.inventory_status_key;
      } else {
        this.device.inventory_status.inventory_status_key = "";
      }
      if (this.is_device_grid_ready) {
        this.device_list_angular_grid.filterService.updateFilters([
          {
            columnId: "is_commissioned",
            searchTerms: ["true"],
            operator: OperatorType.equal,
          },
          {
            columnId: "inventory_status",
            searchTerms: [this.device.inventory_status.inventory_status_key],
            operator: OperatorType.equal,
          },
        ]);
      }
    });
    this.setupDeviceListGrid();
  }
  is_loading: boolean = false;

  /* slick grid */
  device_list_angular_grid: AngularGridInstance;
  device_list_grid: any;
  device_list_grid_service: GridService;
  device_list_grid_data_view: any;
  device_list_grid_column_definitions: Column[];
  device_list_grid_options: GridOption;
  device_list_grid_dataset: Array<DeviceModelCriteria>;
  device_list_grid_updated_object: any;
  is_device_grid_ready = false;
  /* variables */
  device: DeviceModelCriteria = new DeviceModelCriteria();
  inventory_status_list: Array<InventoryStatusModel> = [];
  getInventoryStatusList() {
    return this.deviceMasterService.getInventoryStatusList().pipe(
      map((v: ActionRes<Array<InventoryStatusModel>>) => {
        if (_.has(v.item, "0")) {
          v.item.unshift(
            new InventoryStatusModel({ inventory_status_text: "All" })
          );
        }
        return v.item;
      })
    );
  }
  /* slick grid */
  deviceListGridReady(angularGrid: AngularGridInstance) {
    this.device_list_angular_grid = angularGrid;
    this.device_list_grid_data_view = angularGrid.dataView;
    this.device_list_grid = angularGrid.slickGrid;
    this.device_list_grid_service = angularGrid.gridService;
    this.is_device_grid_ready = true;
  }

  getDeviceList(query: string) {
    console.log(query);
    var query_object: any = {};
    _.forEach(query.split("&"), (v) => {
      var [key, value] = v.split("=");
      query_object[key] = value;
    });
    var skip: number = parseInt(_.get(query_object, "$skip", "0"));
    var top: number = parseInt(_.get(query_object, "$top", "0"));
    var page: number = skip / top + 1;
    var filter_obj: any = this.transformFilterAsObject(
      _.get(query_object, "$filter", "")
    );
    console.log({ filter_obj });

    var device = new DeviceModelCriteria();
    if (_.has(filter_obj, "device_name")) {
      device.device_name = filter_obj["device_name"];
    }
    if (_.has(filter_obj, "device_type")) {
      device.device_type = filter_obj["device_type"];
    }
    if (_.has(filter_obj, "serial_no")) {
      device.serial_no = filter_obj["serial_no"];
    }
    if (_.has(filter_obj, "inventory_status.inventory_status_key")) {
      device.inventory_status.inventory_status_key =
        filter_obj["inventory_status.inventory_status_key"];
    }
    if (_.has(filter_obj, "is_commissioned")) {
      device.is_commissioned =
        filter_obj["is_commissioned"] == "true" ? true : false;
    }

    var request = new ActionReq<DeviceModelCriteria>({
      item: device,
    });

    query = `page=${page}&size=${top}`;
    return this.deviceMasterService.getDeviceList(request, query);
    // .subscribe(
    //   (resp: ActionRes<Array<DeviceModel>>) => {
    //     if (resp.item) {
    //       var data = _.map(resp.item, (v, k) => {
    //         var temp: DeviceDatasetModel = new DeviceDatasetModel(v);
    //         temp.device_id = v.id;
    //         temp.id = k + 1;
    //         return temp;
    //       });

    //       console.log("get data", data);
    //       this.device_list_grid_dataset = data;
    //     }
    //   },
    //   (err) => {
    //     this.toastr_service.error("Error getting Devices");
    //   }
    // );
  }
  transformFilterAsObject(filter: string) {
    var sub_string_regex = /substringof\('(?<value>[\w\.]+)', (?<key>[\w\.]+)\)/;
    var filter_array = filter.split("and");
    var filter_obj: any = {};
    _.forEach(filter_array, (v) => {
      var extracted: any = v.match(sub_string_regex);
      if (extracted && extracted["groups"])
        filter_obj[extracted.groups["key"].toLowerCase()] =
          extracted.groups["value"];
    });
    var option_regex = /(?<key>[\w\.]+) eq \'{0,1}(?<value>[\w\.]+)\'{0,1}/;
    _.forEach(filter_array, (v) => {
      var extracted: any = v.match(option_regex);
      if (extracted && extracted["groups"])
        filter_obj[extracted.groups["key"].toLowerCase()] =
          extracted.groups["value"];
    });
    return filter_obj;
  }
  setupDeviceListGrid() {
    this.device_list_grid_column_definitions = [
      // {
      //   id: "",
      //   name: "",
      //   field: "",
      //   minWidth: 40,
      //   maxWidth: 40,
      //   formatter: (
      //     row,
      //     cell,
      //     value,
      //     columnDef,
      //     dataContext
      //   ) => {
      //     return `<i class="fa fa-pencil" style="color:blue;cursor:pointer;padding-left:30%" name="edit" aria-hidden="true"></i>`;
      //   },
      //   onCellClick: this.editDevice
      // },
      {
        name: "",
        field: "id",
        id: "id",
        formatter: Formatters.editIcon,
        minWidth: 50,
        maxWidth: 50,
        onCellClick: (e, args: OnEventArgs) => {
          console.log(args.dataContext);

          this.gotoDeviceMerge(true, args.dataContext.id);
        },
      },
      // {
      //   name: "#",
      //   field: "",
      //   id: "",
      //   formatter: function (row) {
      //     return (row + 1).toString();
      //   },
      //   minWidth: 50,
      //   maxWidth: 50,
      // },
      {
        id: "device_name",
        name: "Name",
        field: "device_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.input },
        onCellClick: this.showDeviceValuesPopup,
      },
      {
        id: "inventory_status",
        name: "Inventory Status",
        field: "inventory_status.inventory_status_key",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        // filterable: true,
        // filter: { model: Filters.input },
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var inventory_status_text = _.get(
            dataContext,
            "inventory_status.inventory_status_text",
            ""
          );
          return inventory_status_text;
        },
        filterable: true,
        filter: {
          // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
          // enableRenderHtml: true,
          // collection: [{ value: '', label: '' }, { value: true, label: 'True', labelPrefix: `<i class="fa fa-check"></i> ` }, { value: false, label: 'False' }],

          collectionAsync: this.getInventoryStatusList(),
          customStructure: {
            value: "inventory_status_key",
            label: "inventory_status_text",
          },
          model: Filters.singleSelect,

          // we could add certain option(s) to the "multiple-select" plugin
          filterOptions: {
            autoDropWidth: true,
          },
        },
      },
      {
        id: "device_type",
        name: "Type",
        field: "device_type",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        //maxWidth: 120,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "is_commissioned",
        name: "Commissioned",
        field: "is_commissioned",
        type: FieldType.boolean,
        // sortable: true,
        minWidth: 120,
        //maxWidth: 120,
        filterable: true,
        filter: {
          model: Filters.singleSelect,
          collection: [
            { value: true, label: "True" },
            { value: false, label: "False" },
          ],
        },
      },
      {
        id: "last_seen",
        name: "Last seen",
        field: "last_seen",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
        // filterable: true,
        // filter: { model: Filters.input },
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var last_seen_string = "";
          if (_.get(dataContext, "last_seen", null) != null) {
            last_seen_string = moment(dataContext.last_seen).format(
              "MM-DD-YYYY H:mm:ss"
            );
          }
          return last_seen_string;
        },
        onCellClick: this.showDeviceLastSeenHistoryPopup,
      },
      {
        id: "serial_no",
        name: "Serial Number",
        field: "serial_no",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
        //maxWidth: 160,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "ip_address",
        name: "IP Address",
        field: "ip_address",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
        //maxWidth: 160,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "mac_address",
        name: "MAC Address",
        field: "mac_address",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
        //maxWidth: 160,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "battery_capacity",
        name: "Battery",
        field: "battery_capacity",
        sortable: true,
        minWidth: 120,
        //maxWidth: 140,
        formatter: (row, cell, value, columnDef, dataContext) => {
          var percent =
            value != null && value != ""
              ? parseFloat((value as string).replace("%", ""))
              : 0;
          if (dataContext.device_type == "IDH") {
            if (percent < 30) {
              return `<img src="assets/images/battery-status/battery-low.png"  width="20" height="20">`;
            } else if (percent < 70) {
              return `<img src="assets/images/battery-status/battery-medium.png"  width="20" height="20">`;
            } else if (percent < 100) {
              return `<img src="assets/images/battery-status/battery-high.png"  width="20" height="20">`;
            }
          }
        },
        type: FieldType.string,
        onCellClick: this.showDeviceBatteryStatusHistoryPopup,
      },
      {
        name: "Network",
        field: "network_signal",
        id: "network_signal",
        formatter: (row, cell, value, columnDef, dataContext) => {
          var percent = 0;
          if (_.isNumber(value)) {
            percent = this.dBmToPercentageService.getPercentage(value);
          }
          if (percent < 30) {
            return `<img src="assets/images/signal-strength/connection-low.png"  width="20" height="20">`;
          } else if (percent < 70) {
            return `<img src="assets/images/signal-strength/connection-medium.png"  width="20" height="20">`;
          } else {
            return `<img src="assets/images/signal-strength/connection-full.png"  width="20" height="20">`;
          }
        },
        minWidth: 120,
        onCellClick: this.showDeviceNetworkHistoryPopup,
      },
      {
        id: "hardware_version",
        name: "Hardware Version",
        field: "hardware_version",
        sortable: false,
        minWidth: 120,
        //maxWidth: 140,
        type: FieldType.string,
      },
      {
        id: "software_version",
        name: "Software Version",
        field: "software_version",
        sortable: false,
        minWidth: 120,
        //maxWidth: 140,
        type: FieldType.string,
        onCellClick: this.showSoftwareVersionHistoryPopup,
      },
      {
        id: "facility",
        name: "Facility",
        field: "facility.Name",
        sortable: false,
        minWidth: 110,
        //maxWidth: 120,
        type: FieldType.string,
        formatter: Formatters.complexObject,
      },
    ];
    this.device_list_grid_options = {
      asyncEditorLoading: false,
      autoResize: {
        containerId: "device-list-grid-container",
        // sidePadding: 15,
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableFiltering: true,
      enableGrouping: true,
      pagination: {
        pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: 10,
        totalItems: 0,
      },
      presets: {
        filters: [
          {
            columnId: "is_commissioned",
            searchTerms: ["true"],
            operator: OperatorType.equal,
          },
          {
            columnId: "inventory_status",
            searchTerms: [this.device.inventory_status.inventory_status_key],
            operator: OperatorType.equal,
          },
        ],
        // you can also type operator as string, e.g.: operator: 'EQ'
        pagination: { pageNumber: 1, pageSize: 20 },
      },
      backendServiceApi: {
        service: new GridOdataService(),
        options: {
          enableCount: true, // add the count in the OData query, which will return a property named "odata.count" (v2) or "@odata.count" (v4)
          version: 2, // defaults to 2, the query string is slightly different between OData 2 and 4
        } as OdataOption,
        preProcess: () => {
          this.is_loading = true;
        },
        process: (query) => this.getDeviceList(query),
        postProcess: (response) => {
          this.device_list_grid_dataset = response.item;
          this.device_list_grid_options.pagination.totalItems =
            response["total_count"];
          this.device_list_grid_options = Object.assign(
            {},
            this.device_list_grid_options
          );
          this.is_loading = false;
        },
        onError: (e) => {
          console.log("error", e);
          this.is_loading = false;
        },
      },
    };
  }
  // editDevice = (e, args: OnEventArgs) => {
  //   this.device_master = args.dataContext;
  // }
  // clear = () => {
  //   this.device_master = new DeviceModel();
  // }
  // save = () => {
  //   var post_data = new ActionReq<DeviceModel>({
  //     item: this.device_master
  //   })
  //   console.log("post_data", post_data);
  //   this.deviceMasterService.saveDevice(post_data).subscribe(
  //     (resp: any) => {
  //       if (resp.item) {
  //         this.toastr_service.success("save/update successfully");
  //         this.getDeviceList();
  //       }
  //     },
  //     (error) => {
  //       this.toastr_service.error("Error");
  //     }
  //   );
  // }
  gotoDeviceMerge(is_edit: boolean = false, id: number = 0) {
    if (is_edit) {
      this.router.navigate(["device-merge"], {
        relativeTo: this.route,
        queryParams: {
          id,
        },
      });
    } else {
      this.router.navigate(["device-merge"], {
        relativeTo: this.route,
      });
    }
  }
  gotoImportDevices() {
    this.router.navigate(["import-devices"], {
      relativeTo: this.route,
    });
  }
  resetGrid() {
    var current_filters = this.device_list_angular_grid.filterService.getCurrentLocalFilters();
    // this.device_list_angular_grid.gridService.resetGrid();
    this.device_list_angular_grid.filterService.updateFilters(current_filters);
  }
  resetGridWithCurrentFilter() {
    var current_filters = this.device_list_angular_grid.filterService.getCurrentLocalFilters();
    // this.device_list_angular_grid.gridService.resetGrid();
    this.device_list_angular_grid.filterService.updateFilters(current_filters);
  }
  showDeviceLastSeenHistoryPopup = (e, args: OnEventArgs) => {
    const alert = this.dialog.open(DeviceLastSeenHistoryDialog, {
      height: "90vh",
      width: "90vw",
      data: args.dataContext,
    });
    alert.afterClosed().subscribe(() => {});
  };
  showSoftwareVersionHistoryPopup = (e, args: OnEventArgs) => {
    const alert = this.dialog.open(SoftwareVersionHistoryDialog, {
      height: "90vh",
      width: "90vw",
      data: new DeviceSoftwareVersionCriteria({
        device_id: args.dataContext.id,
        device: args.dataContext,
      }),
    });
    alert.afterClosed().subscribe(() => {});
  };
  showDeviceBatteryStatusHistoryPopup = (e, args: OnEventArgs) => {
    if (args.dataContext.device_type == "IDH") {
      const alert = this.dialog.open(DeviceBatteryStatusHistoryDialog, {
        height: "90vh",
        width: "90vw",
        // data: args.dataContext,
        data: args.dataContext,
      });
      alert.afterClosed().subscribe(() => {});
    }
  };
  showDeviceNetworkHistoryPopup = (e, args: OnEventArgs) => {
    const alert = this.dialog.open(DeviceNetworkHistoryDialog, {
      height: "90vh",
      width: "90vw",
      // data: args.dataContext,
      data: {
        device_id: args.dataContext.id,
        device_name: args.dataContext.device_name,
        device_type: args.dataContext.device_type,
        serial_no: args.dataContext.serial_no,
        idh_session_id: args.dataContext.idh_session_id,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
  showDeviceValuesPopup = (e, args: OnEventArgs) => {
    const alert = this.dialog.open(DeviceinfoComponent, {
      height: "90vh",
      width: "90vw",
      // data: args.dataContext,
      data: {
        device_id: args.dataContext.id,
        device_name: args.dataContext.device_name,
        device_type: args.dataContext.device_type,
        serial_no: args.dataContext.serial_no,
        idh_session_id: args.dataContext.idh_session_id,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
}
