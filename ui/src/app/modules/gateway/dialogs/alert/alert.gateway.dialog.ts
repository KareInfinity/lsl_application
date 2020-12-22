import { Component, Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import * as _ from "lodash";
@Component({
  selector: "gateway-alert-dialog",
  templateUrl: "./alert.gateway.dialog.html",
  styleUrls: ["./alert.gateway.dialog.scss"],
})
export class AlertGatewayDialog {
  constructor(
    public dialogRef: MatDialogRef<AlertGatewayDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {
    this.message = data.message;
  }
  message: string = "";
  cancel(): void {
    this.dialogRef.close(false);
  }
  ok() {
    this.dialogRef.close(true);
  }
}
