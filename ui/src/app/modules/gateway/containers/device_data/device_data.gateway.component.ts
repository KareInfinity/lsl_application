import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
  Grouping,
  Formatter,
  OnEventArgs,
  Formatters,
  BsDropDownService,
  Sorters,
  SortDirectionNumber,
} from "angular-slickgrid";
import { DeviceModel, DeviceModelCriteria } from "../../models/device.model";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { DeviceDataGatewayService } from "./device_data.gateway.service";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import * as _ from "lodash";
import { MatDialog } from "@angular/material";
import * as moment from "moment";
import { DeviceinfoComponent } from "../../dialogs/deviceinfo/deviceinfo.component";
import { CustomActionFormatterComponent } from "./custom-actionFormatter.component";
import { DexcominfoGatewayDialog } from "../../dialogs/dexcominfo/dexcominfo.gateway.dialog";
import { DeviceNetworkHistoryDialog } from "../../dialogs/devicenetworkhistory/devicenetworkhistory.component";
import { DeviceBatteryStatusHistoryDialog } from "../../dialogs/devicebatteystatushistory/devicebatterystatushistory.component";
import { IdhSessionHistoryDialog } from "../../dialogs/idhsessionhistory/idhsessionhistory.dialog";
import { dBmToPercentageService } from "../../utils/dbmtopercentage.utils";
import { ToastrService } from "ngx-toastr";
import {
  DeviceDatasetModel,
  DeviceWithIDHDatasetModel,
} from "./models/devicedataset.model";
@Component({
  selector: "gateway-devices",
  templateUrl: "./device_data.gateway.component.html",
  styleUrls: ["./device_data.gateway.component.scss"],
  // entryComponents : [CustomActionFormatterComponent]
})
export class DeviceDataGatewayComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: DeviceDataGatewayService,
    public dialog: MatDialog,
    private bsDropdown: BsDropDownService,
    private dBmToPercentageService: dBmToPercentageService,
    private toastr_service: ToastrService
  ) {}
  ngOnInit() {
    $("#filter-collapse").on("hidden.bs.collapse", () => {
      this.device_list_grid_service.resetGrid();
    });
    this.setupDeviceListGrid();
    this.search();
  }
  is_loading: boolean = false;
  device: DeviceModelCriteria = new DeviceModelCriteria();
  device_type_list = [
    {
      feature_name: "IDH",
    },
    {
      feature_name: "IV Watch",
    },
    {
      feature_name: "DexcomG6",
    },
  ];
  /* slick grid */
  is_grouped_by_idh = false;
  device_list_angular_grid: AngularGridInstance;
  device_list_grid: any;
  device_list_grid_service: GridService;
  device_list_grid_data_view: any;
  device_list_grid_column_definitions: Column[];
  device_list_grid_options: GridOption;
  device_list_grid_dataset:
    | Array<DeviceDatasetModel>
    | Array<DeviceWithIDHDatasetModel>;
  device_list_grid_updated_object: any;
  selected_device_rows = [];
  device_list: Array<DeviceDatasetModel> = [];

  /* slick grid */
  deviceListGridReady(angularGrid: AngularGridInstance) {
    this.device_list_angular_grid = angularGrid;
    this.device_list_grid_data_view = angularGrid.dataView;
    this.device_list_grid = angularGrid.slickGrid;
    this.device_list_grid_service = angularGrid.gridService;
  }
  async onDeviceListGridCellChanged(e, args) {
    this.device_list_grid_updated_object = args.item;
    // this.device_list_angular_grid.resizerService.resizeGrid(10);
  }
  setupDeviceListGrid(is_groupedby_idh_session: boolean = false) {
    this.device_list_grid_column_definitions = [
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
      },
      {
        name: "",
        field: "id",
        id: "id",
        formatter: function (row, cell, value, columnDef, dataContext) {
          if (dataContext.device_type == "DexcomG6") {
            // return `<span class="material-icons text-dark">
            //         info
            //       </span>`;
            return Formatters.infoIcon(
              row,
              cell,
              value,
              columnDef,
              dataContext
            );
          } else {
            return "";
          }
        },
        minWidth: 50,
        //maxWidth: 50,
        onCellClick: this.showDexcomInfoPopup,
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
        filter: {
          model: Filters.multipleSelect,
          collection: _.map(this.device_type_list, (v) => {
            return {
              label: v.feature_name,
              value: v.feature_name,
            };
          }),
        },
      },
      {
        id: "last_seen",
        name: "Last seen",
        field: "last_seen",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
        filterable: true,
        filter: { model: Filters.input },
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
        name: "",
        field: "",
        id: "",
        formatter: this.showPopup,
        minWidth: 50,
        onCellClick: this.showDevicePopup,
      },
      {
        id: "barcode",
        name: "Barcode",
        field: "barcode",
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
          var percent = 0;
          if (value != null && value != "") {
            percent = parseFloat((value as string).replace("%", ""));
          }

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
      },
      {
        id: "ip_address",
        name: "IP Address",
        field: "ip_address",
        sortable: false,
        minWidth: 120,
        //maxWidth: 140,
        type: FieldType.string,
      },
      {
        name: "",
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
        minWidth: 50,
        onCellClick: this.showDeviceNetworkHistoryPopup,
      },
      {
        id: "mac_address",
        name: "MAC Address",
        field: "mac_address",
        sortable: false,
        minWidth: 120,
        toolTip: "mac_address",
        //maxWidth: 140,
        type: FieldType.string,
      },
      {
        id: "facility",
        name: "Facility",
        field: "facility",
        sortable: false,
        minWidth: 110,
        //maxWidth: 120,
        type: FieldType.string,
      },
      {
        id: "physical_location",
        name: "Physical location",
        field: "physical_location",
        sortable: false,
        minWidth: 110,
        //maxWidth: 120,
        type: FieldType.string,
      },
      /* {
        id: "tags",
        name: "Tags",
        field: "tags",
        sortable: false,
        minWidth: 110,
        //maxWidth: 120,
        type: FieldType.string,
      }, 
      {
        id: "idh_session_id",
        name: "IDH Session ID",
        field: "idh_session_id",
        sortable: false,
        minWidth: 110,
        //maxWidth: 120,
        type: FieldType.string,
      }, */
    ];
    if (is_groupedby_idh_session == true) {
      this.device_list_grid_column_definitions.unshift({
        id: "idh_serial_no",
        name: "IDH Serial No.",
        field: "idh_serial_no",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.input },
        formatter: (row, cell, value) => {
          return "";
        },
      });
    }
    this.device_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "device-list-grid-container",
        sidePadding: 15,
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableFiltering: true,
      enableGrouping: true,
      //   checkboxSelector: {
      //     // you can toggle these 2 properties to show the "select all" checkbox in different location
      //     hideInFilterHeaderRow: false,
      //     hideInColumnTitleRow: true,
      //   },
      //   rowSelectionOptions: {
      //     // True (Single Selection), False (Multiple Selections)
      //     selectActiveRow: false,
      //   },
      // enableCheckboxSelector: true,
      // enableRowSelection: true
    };
  }
  resetGrid() {
    this.is_grouped_by_idh = false;

    this.device_list_grid_data_view.setGrouping([]);
    this.device_list_grid_dataset = this.device_list;
    this.setupDeviceListGrid();
    this.device_list_grid_service.resetGrid();
  }
  resetFilter() {
    this.device = new DeviceModelCriteria();
  }
  resetPage() {
    this.resetFilter();
    this.resetGrid();
  }
  showIDHDevices() {
    this.resetGrid();
    this.device_list_angular_grid.filterService.updateFilters([
      { columnId: "device_type", searchTerms: ["IDH"] },
    ]);
    // this.device_list_grid_dataset = this.device_list;
    // this.setupDeviceListGrid();
    // this.device_list_grid_service.resetGrid();
    // this.device_list_grid_dataset = this.getIDHDevices();
  }

  // getIDHDevices() {
  //   var idh_list = _.filter(this.device_list, (v) => {
  //     var is_idh = v.device_type == "IDH";
  //     return is_idh;
  //   });
  //   return idh_list;
  // }

  groupByIDH() {
    this.is_grouped_by_idh = true;
    this.device_list_grid_dataset = this.getDevicesWithAssociatedIDHInfo();
    this.setupDeviceListGrid(true);
    this.device_list_grid_service.resetGrid();
    this.device_list_grid_data_view.setGrouping({
      getter: "idh_session_id",
      formatter: (g) => {
        var element = _.get(g, "rows.0", null);
        // console.log("Element Serial no: ", element.idh_serial_no);
        if (element) {
          return `IDH: ${element.idh_serial_no} <span style="color:green">(${g.count} items)</span>`;
        }
        return "";
      },
      comparer: (a, b) =>
        Sorters.date(a.idh_last_seen, b.idh_last_seen, SortDirectionNumber.asc),

      aggregateCollapsed: false,
    } as Grouping);
  }
  getDevicesWithAssociatedIDHInfo() {
    var idh_list = _.filter(this.device_list, (v) => {
      var is_idh = v.device_type == "IDH";
      var has_session = v.idh_session_id != 0;
      return is_idh && has_session;
    });

    var idh_list_object_with_sessionid_as_key = _.keyBy(
      idh_list,
      "idh_session_id"
    );

    var non_idh_device_list: Array<DeviceModel> = _.filter(
      this.device_list,
      (v) => {
        var is_idh = v.device_type == "IDH";
        return !is_idh;
      }
    );

    /* add idh information to which the devices are associated  */
    var devices_with_idh = _.map(non_idh_device_list, (v) => {
      var temp = new DeviceWithIDHDatasetModel(v);
      var idh = idh_list_object_with_sessionid_as_key[v.idh_session_id];
      if (idh) {
        temp.idh_id = idh.id;
        temp.idh_device_name = idh.device_name;
        temp.idh_device_type = idh.device_type;
        temp.idh_last_seen = idh.last_seen;
        temp.barcode = idh.barcode;
        temp.battery_capacity = idh.battery_capacity;
        temp.idh_hardware_version = idh.hardware_version;
        temp.idh_software_version = idh.software_version;
        temp.idh_communication_mode = idh.communication_mode;
        temp.idh_ip_address = idh.ip_address;
        temp.idh_mac_address = idh.mac_address;
        temp.idh_serial_no = idh.serial_no;
        temp.idh_facility = idh.facility;
        temp.idh_tags = idh.tags;
        temp.idh_physical_location = idh.physical_location;
        temp.idh_attributes = idh.attributes;
        temp.idh_created_by = idh.created_by;
        temp.idh_modified_by = idh.modified_by;
        temp.idh_created_on = idh.created_on;
        temp.idh_modified_on = idh.modified_on;
        temp.idh_is_active = idh.is_active;
        temp.idh_is_factory = idh.is_factory;
      }
      return temp;
    });
    return devices_with_idh;
  }
  showPopup: Formatter = (row, cell, value, columnDef, dataContext) => {
    return `<span class="material-icons" style="color:green;font-size:16px;cursor:pointer;">details</span>`;
  };
  showDevicePopup = (e, args: OnEventArgs) => {
    if (args.dataContext.device_type == "IDH") {
      const alert = this.dialog.open(IdhSessionHistoryDialog, {
        height: "90vh",
        width: "90vw",
        data: {
          device_id: args.dataContext.device_id,
          device_name: args.dataContext.device_name,
          device_type: args.dataContext.device_type,
          serial_no: args.dataContext.serial_no,
        },
      });
      alert.afterClosed().subscribe((can_Delete) => {});
    } else {
      const alert = this.dialog.open(DeviceinfoComponent, {
        height: "90vh",
        width: "90vw",
        data: {
          device_id: args.dataContext.device_id,
          device_name: args.dataContext.device_name,
          device_type: args.dataContext.device_type,
          serial_no: args.dataContext.serial_no,
          idh_session_id: args.dataContext.idh_session_id,
        },
      });
      alert.afterClosed().subscribe((can_Delete) => {});
    }
  };
  showDexcomInfoPopup = (e, args: OnEventArgs) => {
    if (args.dataContext.device_type == "DexcomG6") {
      const alert = this.dialog.open(DexcominfoGatewayDialog, {
        maxHeight: "90vh",
        width: "40vw",
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
        device_id: args.dataContext.device_id,
        device_name: args.dataContext.device_name,
        device_type: args.dataContext.device_type,
        serial_no: args.dataContext.serial_no,
        idh_session_id: args.dataContext.idh_session_id,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
  showDeviceBatteryStatusHistoryPopup = (e, args: OnEventArgs) => {
    if (args.dataContext.device_type == "IDH") {
      const alert = this.dialog.open(DeviceBatteryStatusHistoryDialog, {
        height: "90vh",
        width: "90vw",
        // data: args.dataContext,
        data: {
          device_id: args.dataContext.device_id,
          device_name: args.dataContext.device_name,
          device_type: args.dataContext.device_type,
          serial_no: args.dataContext.serial_no,
          idh_session_id: args.dataContext.idh_session_id,
        },
      });
      alert.afterClosed().subscribe(() => {});
    }
  };
  search() {
    if (this.device.device_type != "" && this.device.serial_no == "") {
      if (this.device.from_date == null || this.device.to_date == null) {
        this.toastr_service.error("Choose Date Range");
        return;
      }
    }
    if (this.device.from_date != null || this.device.from_date != null) {
      var from = moment(this.device.from_date);
      var to = moment(this.device.to_date);
      var different_in_hours = to.diff(from, "hours");
      if (different_in_hours >= 24 || different_in_hours <= 0) {
        this.toastr_service.error(
          "Date range interval should be between 1 and 24 hours"
        );
        return;
      }
    }
    // if (
    //   this.device.from_date == null &&
    //   this.device.from_date == null &&
    //   this.device.serial_no == ""
    // ) {
    //   this.device.to_date = new Date();
    //   this.device.from_date = moment(this.device.to_date)
    //     .subtract(24, "hours")
    //     .toDate();
    // }
    if (this.device.device_type == "" && this.device.serial_no == "") {
      this.device.device_type = DeviceModel.DeviceTypes.idh;
    }
    var request = new ActionReq<DeviceModelCriteria>({
      item: this.device,
    });
    this.is_loading = true;
    this.service
      .getDeviceList(request)
      .subscribe(
        (resp: ActionRes<Array<DeviceModel>>) => {
          if (resp.item.length > 0) {
            // if (this.device.device_type == DeviceModel.DeviceTypes.idh) {
            //   this.toastr_service.info("Fetched IDH Devices Successfully. Click the Ungroup button to view the Devices");
            // }
            // else
            //   this.toastr_service.success("Fetched Devices Successfully");
            var device_list: Array<DeviceDatasetModel> = _.map(
              resp.item,
              (v, k) => {
                var temp: DeviceDatasetModel = new DeviceDatasetModel(v);
                temp.device_id = v.id;
                temp.id = k + 1;
                return temp;
              }
            );
            this.device_list = device_list;
            this.device_list_grid_dataset = device_list;
            // if (this.device.device_type == DeviceModel.DeviceTypes.idh) {
            //   this.groupByIDH();
            // } else {
            this.resetGrid();
            // }
          } else {
            this.device_list_grid_dataset = [];
          }
        },
        (err) => {
          this.toastr_service.error("Couldn't get Active Devices");
        }
      )
      .add(() => {
        this.is_loading = false;
      });
  }
}
