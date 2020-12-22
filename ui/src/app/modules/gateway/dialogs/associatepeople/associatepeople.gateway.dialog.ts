import { Component, Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import {
  DevicePeopleModel,
  DevicePeopleModelCriteria,
} from "../../models/devicepeople.model";
import { AssociatePeopleGatewayDialogService } from "./associatepeople.gateway.dialog.service";
import * as _ from "lodash";
@Component({
  selector: "gateway-associatepeople-dialog",
  templateUrl: "./associatepeople.gateway.dialog.html",
  styleUrls: ["./associatepeople.gateway.dialog.scss"],
})
export class AssociatePeopleGatewayDialog {
  constructor(
    public dialogRef: MatDialogRef<AssociatePeopleGatewayDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DevicePeopleModelCriteria,
    private service: AssociatePeopleGatewayDialogService,
    private toatr_service: ToastrService
  ) {
    this.device_people = this.data;
  }
  is_loading: boolean = false;
  device_people: DevicePeopleModelCriteria = new DevicePeopleModelCriteria();
  device_type_list: Array<string> = ["IDH", "DexcomG6"];
  close(): void {
    this.dialogRef.close();
  }
  save(form: NgForm) {
    if (form.valid) {
      var request = new ActionReq<DevicePeopleModelCriteria>({
        item: this.device_people,
      });
      this.is_loading = true;
      this.service
        .saveAssociation(request)
        .subscribe(
          (resp) => {
            this.toatr_service.success("Associated successfully");
            this.dialogRef.close(true);
          },
          (err) => {
            var message = "Association failed";
            if (_.has(err, "error.message")) {
              message = err.error.message;
            }
            this.toatr_service.error(message);
          }
        )
        .add(() => {
          this.is_loading = false;
        });
    }
  }
}
