import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AngularGridInstance,
  Column,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  GridService,
} from "angular-slickgrid";
import { ToastrService } from "ngx-toastr";
import { DeviceDatasetModel } from "../device_master/models/devicedataset.model";
import { ImportDevicesService } from "./import-devices.gateway.service";
import * as _ from "lodash";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { DeviceModel, DeviceModelCriteria } from "../../models/device.model";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { Location } from "@angular/common";
import { json_custom_parser } from "src/app/modules/global/utils/jsoncustomparser";
@Component({
  selector: "gateway-import-devices",
  templateUrl: "./import-devices.gateway.component.html",
  styleUrls: ["./import-devices.gateway.component.css"],
})
export class ImportDevicesGatewayComponent implements OnInit {
  constructor(
    private service: ImportDevicesService,
    private toastr_service: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadSampleData();
    this.setupDeviceListGrid();
  }
  is_loading: boolean = false;
  devices_sheet: string = "";
  /* slick grid */
  device_list_angular_grid: AngularGridInstance;
  device_list_grid: any;
  device_list_grid_service: GridService;
  device_list_grid_data_view: any;
  device_list_grid_column_definitions: Column[];
  device_list_grid_options: GridOption;
  device_list_grid_dataset: Array<DeviceModelCriteria>;
  device_list_grid_updated_object: any;
  grid_label_key_mapping: any = {
    Error: "error",
    "Device Name": "device_name",
    "Device Type": "device_type",
    "Serial No.": "serial_no",
    Barcode: "barcode",
    "Hardware Version ": "hardware_version",
    "Software Version": "software_version",
    "MAC Address": "mac_address",
    Facility: "facility",
    "Physical Location": "physical_location",
    Attributes: "attributes",
  };
  /* slick grid */
  deviceListGridReady(angularGrid: AngularGridInstance) {
    this.device_list_angular_grid = angularGrid;
    this.device_list_grid_data_view = angularGrid.dataView;
    this.device_list_grid = angularGrid.slickGrid;
    this.device_list_grid_service = angularGrid.gridService;
  }
  /* variables */
  loadSampleData() {
    this.device_list_grid_dataset = [
      new DeviceModelCriteria({
        id: 1,
        device_type: DeviceModel.DeviceTypes.dexcom,
      }),
    ];
    _.forEach(this.device_list_grid_dataset, (v) => {
      if (v.attributes) {
        v.attributes = JSON.stringify(v.attributes);
      }
    });
  }
  setupDeviceListGrid() {
    this.device_list_grid_column_definitions = [
      {
        id: "error",
        name: "Error",
        field: "error",
        sortable: false,
        minWidth: 110,
        //maxWidth: 120,
        type: FieldType.string,
        toolTip: "error",

        // formatter: (row, cell, value, columndef, datacontext, grid) => {
        //   if (value != "") {
        //     return Formatters.infoIcon(
        //       row,
        //       cell,
        //       value,
        //       columndef,
        //       datacontext,
        //       grid
        //     );
        //   } else {
        //     return "";
        //   }
        // },
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
        minWidth: 120,
        //maxWidth: 120,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "serial_no",
        name: "Serial No.",
        field: "serial_no",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
        //maxWidth: 160,
        filterable: true,
        filter: { model: Filters.compoundInput },
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
        filter: { model: Filters.compoundInput },
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
        field: "facility.Name",
        sortable: false,
        minWidth: 110,
        //maxWidth: 120,
        type: FieldType.string,
        formatter: Formatters.complexObject,
      },
      {
        id: "physical_location",
        name: "Physical Location",
        field: "physical_location",
        sortable: false,
        minWidth: 110,
        //maxWidth: 120,
        type: FieldType.string,
      },
      {
        id: "attributes",
        name: "Attributes",
        field: "attributes",
        sortable: false,
        minWidth: 110,
        //maxWidth: 120,
        type: FieldType.string,
        formatter: (row, cell, value, columndef, datacontext, grid) => {
          var attributes = value;
          if (typeof value != "string") {
            attributes = JSON.stringify(value);
          }
          return attributes;
        },
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
      enableAutoTooltip: true,
    };
  }
  // save = () => {
  //   var post_data = new ActionReq<DeviceModel>({
  //     item: this.device_master
  //   })
  //   console.log("post_data", post_data);
  //   this.deviceMasterService.saveDevice(post_data).subscribe(
  //     (resp: any) => {
  //       if (resp.item) {
  //         this.toastr_service.success("save/update successfully");
  //         this.getData();
  //       }
  //     },
  //     (error) => {
  //       this.toastr_service.error("Error");
  //     }
  //   );
  // }
  onFileChange(e) {
    console.log(e);
    let workBook = null;
    let json_data = null;
    const reader = new FileReader();
    const file = e.target.files[0];
    this.devices_sheet = e.target.files[0].name;
    reader.onload = (event) => {
      import("xlsx").then((XLSX) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: "binary" });
        json_data = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        const dataString = JSON.stringify(json_data);
        console.log(json_data);
        var device_list = [];
        _.forEach(json_data, (v, k) => {
          device_list = _.concat(device_list, v);
        });

        device_list = _.map(device_list, (item, index) => {
          var device: DeviceModelCriteria = new DeviceModelCriteria();
          device.id = index + 1;
          _.forEach(this.grid_label_key_mapping, (v, k) => {
            device[v] = item[k];
          });
          return device;
        });
        this.device_list_grid_dataset = device_list;
        e.srcElement.value = null;
        // this.devices_sheet = "";
      });
    };
    reader.readAsBinaryString(file);
  }
  import() {
    var is_valid: boolean = true;
    _.forEach(this.device_list_grid_dataset, (v, k) => {
      if (v.serial_no.trim().length == 0) {
        this.toastr_service.warning(`Row ${k} has invalid serial number`);
        is_valid = false;
        return false;
      }
    });
    if ((is_valid as boolean) == false) {
      return;
    }
    this.is_loading = true;
    var formated = _.map(this.device_list_grid_dataset, (v) => {
      v.attributes = json_custom_parser.parse(v.attributes, {});
      return v;
    });
    var request = new ActionReq<Array<DeviceModelCriteria>>({
      item: formated,
    });
    this.service
      .saveBulk(request)
      .subscribe(
        (resp: ActionRes<Array<DeviceModelCriteria>>) => {
          if (_.get(resp, "item", []).length > 0) {
            this.device_list_grid_dataset = _.map(resp.item, (v) => {
              v.attributes = JSON.stringify(v.attributes);
              return v;
            });
            var has_error = false;
            _.forEach(this.device_list_grid_dataset, (v) => {
              if (v.error != "") {
                has_error = true;
              }
            });
            if (has_error) {
              this.toastr_service.info("Imported with some error");
            } else {
              this.toastr_service.success("Imported successfully");
            }
          }
        },
        (error) => {
          this.toastr_service.error("Error importing Devices");
        }
      )
      .add(() => {
        this.is_loading = false;
      });
  }
  goBack() {
    this.location.back();
  }
}
