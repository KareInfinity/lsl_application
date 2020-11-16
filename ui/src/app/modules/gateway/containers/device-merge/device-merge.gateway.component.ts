import { Component, OnInit } from "@angular/core";
import { DeviceModel } from "../../models/device.model";
import * as _ from "lodash";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { DeviceMergeService } from "./device-merge.gateway.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { ToastrService } from "ngx-toastr";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { Action } from "rxjs/internal/scheduler/Action";
@Component({
  selector: "gateway-device-merge",
  templateUrl: "./device-merge.gateway.component.html",
  styleUrls: ["./device-merge.gateway.component.css"],
})
export class DeviceMergeGatewayComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: DeviceMergeService,
    private toatr_service: ToastrService
  ) {}
  ngOnInit() {
    this.getData();
  }
  is_loading: boolean = false;
  is_edit = false;
  device: DeviceModel = new DeviceModel();
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
  getData() {
    this.route.queryParams.subscribe((params) => {
      console.log("params", params);
      if (_.get(params, "id", null) != null) {
        this.is_edit = true;
        var request = new ActionReq<DeviceModel>({
          item: new DeviceModel({ id: parseInt(params["id"]) }),
        });
        this.is_loading = true;
        this.service
          .getDevice(request)
          .subscribe((resp: ActionRes<Array<DeviceModel>>) => {
            if (resp.item.length > 0) {
              this.device = resp.item[0];
            }
          })
          .add(() => {
            this.is_loading = false;
          });
      }
    });
  }
  onChangeDeviceType(type) {
    // if (type == DeviceModel.DeviceTypes.dexcom) {
    //   this.device.attributes = [
    //     { label: "Transmitter Status Code", value: "", key: "tx_status" },
    //     { label: "Error Code", value: "", key: "error_code" },
    //     { label: "CGM Firmware Version", value: "", key: "cgm_firmware" },
    //     { label: "BLE Firmware Version", value: "", key: "ble_firmware_ver" },
    //     { label: "Hardware Version", value: "", key: "hw_version" },
    //     { label: "BLE Soft Device Version", value: "", key: "ble_sw_version" },
    //     {
    //       label: "Hardware ID of the Nordic BLE chip",
    //       value: "",
    //       key: "hw_id",
    //     },
    //     { label: "Transmitter Run Time", value: "", key: "tx_run_time" },
    //     { label: "Algorithm State", value: "", key: "algorithm_state" },
    //     { label: "Transmitter Version", value: "", key: "tx_version" },
    //     { label: "Software Number", value: "", key: "sw_number" },
    //     { label: "API Version", value: "", key: "api_version" },
    //     { label: "RSSI", value: "", key: "RSSI" },
    //     { label: "DexcomXX", value: "", key: "broadcastID" },
    //   ];
    // } else {
    //   this.device.attributes = [];
    // }
  }
  addAttribute() {
    if (
      _.get(this.device, "attributes", null) != null &&
      _.isArray(this.device.attributes)
    ) {
      this.device.attributes.push({
        label: "",
        value: "",
      });
    } else {
      this.device.attributes = [];
      this.device.attributes.push({
        label: "",
        value: "",
      });
    }
  }
  deleteAttrubute(index) {
    (this.device.attributes as Array<any>).splice(index, 1);
  }
  save(form: NgForm) {
    if (form.valid) {
      if (this.device.device_type == DeviceModel.DeviceTypes.dexcom) {
        this.device.is_disposable = true;
        // if (this.device.attributes) {
        //   this.device.attributes = _.forEach(
        //     this.device.device_type,
        //     (v: any) => {
        //       v.key = v.label.toUpperCase().replace(" ", "_");
        //     }
        //   );
        // }
      }
      var request = new ActionReq<DeviceModel>({
        item: this.device,
      });
      this.is_loading = true;
      this.service
        .saveDevice(request)
        .subscribe(
          (resp) => {
            if (resp) {
              if (this.is_edit == false) this.device = new DeviceModel();
              this.toatr_service.success("Device saved successfully");
            }
          },
          (error) => {
            this.toatr_service.error("Error saving Device");
          }
        )
        .add(() => {
          this.is_loading = false;
        });
    }
  }
  close() {
    this.location.back();
  }
}
