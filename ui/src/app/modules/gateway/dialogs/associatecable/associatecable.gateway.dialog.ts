import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AssociateCableGatewayDialogService } from "./associatecable.gateway.dialog.service";
import { ToastrService } from "ngx-toastr";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { CableModel } from "../../models/cable.model";
import { DriverModel } from "../../models/driver.model";
import { Observable } from "rxjs";
import { NgForm } from "@angular/forms";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import * as _ from "lodash";
import { CableDriverMapModel } from "../../models/cabledrivermap.model";
@Component({
  selector: "gateway-associatecable-dialog",
  templateUrl: "./associatecable.gateway.dialog.html",
  styleUrls: ["./associatecable.gateway.dialog.scss"],
})
export class AssociateCableGatewayDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AssociateCableGatewayDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addCableService: AssociateCableGatewayDialogService,
    private toastr_service: ToastrService
  ) {}

  /* variables */
  cable_list: Array<CableModel>;
  selected_cable: CableModel;
  ngOnInit() {
    this.addCableService.getCableList().subscribe(
      (resp: ActionRes<Array<CableModel>>) => {
        if (resp.item) {
          this.cable_list = resp.item;
        }
      },
      (err) => {
        this.toastr_service.error("Error getting Cables");
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
  save(form: NgForm) {
    if (form.valid) {
      var request = new ActionReq<CableDriverMapModel>({
        item: new CableDriverMapModel({
          cable_id: this.selected_cable.id,
          cable_name: this.selected_cable.cable_name,
          driver_id: this.selected_cable.driver_id,
          // driver_name: this.selected_driver.driver_name,
        }),
      });
      this.addCableService.saveCableDriverMap(request).subscribe(
        (resp: ActionRes<CableDriverMapModel>) => {
          this.toastr_service.success("Cable Added");
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);

          var message = "Error occured";
          if (_.has(error, "error.message")) {
            message = error.error.message;
          }
          this.toastr_service.error(message);
        }
      );
    }
  }
  createCable(_req: string) {
    return new CableModel({
      cable_name: _req,
      driver_id: 1,
    });
  }
}
