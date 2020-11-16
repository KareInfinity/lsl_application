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
import { ImportCablesService } from "./import-cabledrivermap.gateway.service";
import * as _ from "lodash";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";

import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { Location } from "@angular/common";
import { CableDriverMapModelCriteria } from "../../models/cabledrivermap.model";
@Component({
  selector: "gateway-import-cabledrivermap",
  templateUrl: "./import-cabledrivermap.gateway.component.html",
  styleUrls: ["./import-cabledrivermap.gateway.component.css"],
})
export class ImportCablesGatewayComponent implements OnInit {
  constructor(
    private service: ImportCablesService,
    private toastr_service: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // this.loadSampleData();
    this.setupCableListGrid();
  }
  is_loading: boolean = false;
  cables_sheet: string = "";
  /* slick grid */
  cable_list_angular_grid: AngularGridInstance;
  cable_list_grid: any;
  cable_list_grid_service: GridService;
  cable_list_grid_data_view: any;
  cable_list_grid_column_definitions: Column[];
  cable_list_grid_options: GridOption;
  cable_list_grid_dataset: Array<CableDriverMapModelCriteria>;
  cable_list_grid_updated_object: any;
  grid_label_key_mapping: any = {
    Error: "error",
    "Cable Name": "cable_name",
  };
  /* slick grid */
  cableListGridReady(angularGrid: AngularGridInstance) {
    this.cable_list_angular_grid = angularGrid;
    this.cable_list_grid_data_view = angularGrid.dataView;
    this.cable_list_grid = angularGrid.slickGrid;
    this.cable_list_grid_service = angularGrid.gridService;
  }
  /* variables */
  // loadSampleData() {
  //   this.cable_list_grid_dataset = [
  //     new CableModelCriteria({
  //       id: 1,
  //       cable_type: CableModel.CableTypes.dexcom,
  //       attributes: [
  //         { label: "Transmitter Status Code", value: "", key: "tx_status" },
  //         { label: "Error Code", value: "", key: "error_code" },
  //         { label: "CGM Firmware Version", value: "", key: "cgm_firmware" },
  //         { label: "BLE Firmware Version", value: "", key: "ble_firmware_ver" },
  //         { label: "Hardware Version", value: "", key: "hw_version" },
  //         {
  //           label: "BLE Soft Cable Version",
  //           value: "",
  //           key: "ble_sw_version",
  //         },
  //         {
  //           label: "Hardware ID of the Nordic BLE chip",
  //           value: "",
  //           key: "hw_id",
  //         },
  //         { label: "Transmitter Run Time", value: "", key: "tx_run_time" },
  //         { label: "Algorithm State", value: "", key: "algorithm_state" },
  //         { label: "Transmitter Version", value: "", key: "tx_version" },
  //         { label: "Software Number", value: "", key: "sw_number" },
  //         { label: "API Version", value: "", key: "api_version" },
  //         { label: "RSSI", value: "", key: "RSSI" },
  //         { label: "DexcomXX", value: "", key: "broadcastID" },
  //       ],
  //     }),
  //     new CableModelCriteria({
  //       id: 2,
  //       cable_type: CableModel.CableTypes.iv_watch,
  //       attributes: [],
  //     }),
  //   ];
  //   _.forEach(this.cable_list_grid_dataset, (v) => {
  //     if (v.attributes) {
  //       v.attributes = JSON.stringify(v.attributes);
  //     }
  //   });
  // }
  setupCableListGrid() {
    this.cable_list_grid_column_definitions = [
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
      {
        name: "#",
        field: "",
        id: "",
        formatter: function (row) {
          return (row + 1).toString();
        },
        minWidth: 50,
        maxWidth: 50,
      },
      {
        id: "cable_name",
        name: "Cable Name",
        field: "cable_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        //maxWidth: 220,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
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
      enableFiltering: true,
      enableGrouping: true,
      enableAutoTooltip: true,
    };
  }
  // save = () => {
  //   var post_data = new ActionReq<CableModel>({
  //     item: this.cable_master
  //   })
  //   console.log("post_data", post_data);
  //   this.cableMasterService.saveCable(post_data).subscribe(
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
    this.cables_sheet = e.target.files[0].name;
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
        var cable_list = [];
        _.forEach(json_data, (v, k) => {
          cable_list = _.concat(cable_list, v);
        });

        cable_list = _.map(cable_list, (item, index) => {
          var cable: CableDriverMapModelCriteria = new CableDriverMapModelCriteria();
          cable.id = index + 1;
          _.forEach(this.grid_label_key_mapping, (v, k) => {
            cable[v] = item[k];
          });
          return cable;
        });
        this.cable_list_grid_dataset = cable_list;
        e.srcElement.value = null;
        // this.cables_sheet = "";
      });
    };
    reader.readAsBinaryString(file);
  }
  import() {
    var is_valid: boolean = true;
    _.forEach(this.cable_list_grid_dataset, (v, k) => {
      if (v.cable_name.trim().length == 0) {
        this.toastr_service.warning(`Row ${k} has invalid cable name`);
        is_valid = false;
        return false;
      }
    });
    if ((is_valid as boolean) == false) {
      return;
    }
    this.is_loading = true;
    var request = new ActionReq<Array<CableDriverMapModelCriteria>>({
      item: this.cable_list_grid_dataset,
    });
    this.service
      .saveBulk(request)
      .subscribe(
        (resp: ActionRes<Array<CableDriverMapModelCriteria>>) => {
          if (_.get(resp, "item", []).length > 0) {
            this.cable_list_grid_dataset = resp.item;
            var has_error = false;
            _.forEach(this.cable_list_grid_dataset, (v) => {
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
          this.toastr_service.error("Error mapping Cables");
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
