import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import * as _ from "lodash";

@Component({
  selector: "gateway-dexcominfo-dialog",
  templateUrl: "./dexcominfo.gateway.dialog.html",
  styleUrls: ["./dexcominfo.gateway.dialog.scss"],
})
export class DexcominfoGatewayDialog {
  constructor(
    public dialogRef: MatDialogRef<DexcominfoGatewayDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.transformData(data.attributes);
  }

  transformData(data) {
    var attribute_model_mapping = {
      tx_status: "Transmitter Status Code",
      error_code: "Error Code",
      cgm_firmware: "CGM Firmware Version",
      ble_firmware_ver: "BLE Firmware Version",
      hw_version: "Hardware Version",
      ble_sw_version: "BLE Soft Device Version",
      hw_id: "Hardware ID of the Nordic BLE chip",
      tx_run_time: "Transmitter Run Time",
      algorithm_state: "Algorithm State",
      tx_version: "Transmitter Version",
      sw_number: "Software Number",
      api_version: "API Version",
      RSSI: "RSSI",
      broadcastID: "DexcomXX",
    };
    _.forEach(data, (v, k) => {
      this.attributes.push({ key: attribute_model_mapping[k], value: v });
    });
  }
  attributes: Array<{ key: string; value: string }> = [];
  close(): void {
    this.dialogRef.close();
  }
  search() {
    this.dialogRef.close(1);
  }
}
