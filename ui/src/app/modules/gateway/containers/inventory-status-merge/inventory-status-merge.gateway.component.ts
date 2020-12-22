import { Component, OnInit } from "@angular/core";
import { InventoryStatusModel } from "../../models/inventorystatus.model";
import * as _ from "lodash";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { InventoryStatusMergeService } from "./inventory-status-merge.gateway.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { ToastrService } from "ngx-toastr";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { Action } from "rxjs/internal/scheduler/Action";
@Component({
  selector: "gateway-inventory_status-merge",
  templateUrl: "./inventory-status-merge.gateway.component.html",
  styleUrls: ["./inventory-status-merge.gateway.component.css"],
})
export class InventoryStatusMergeGatewayComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: InventoryStatusMergeService,
    private toatr_service: ToastrService
  ) {}
  ngOnInit() {
    this.getData();
  }
  is_loading: boolean = false;
  is_edit = false;
  inventory_status: InventoryStatusModel = new InventoryStatusModel();
  getData() {
    this.route.queryParams.subscribe((params) => {
      if (_.get(params, "id", null) != null) {
        this.is_edit = true;
        var request = new ActionReq<InventoryStatusModel>({
          item: new InventoryStatusModel({ id: parseInt(params["id"]) }),
        });
        this.is_loading = true;
        this.service
          .getInventoryStatus(request)
          .subscribe((resp: ActionRes<Array<InventoryStatusModel>>) => {
            if (resp.item.length > 0) {
              this.inventory_status = resp.item[0];
            }
          })
          .add(() => {
            this.is_loading = false;
          });
      }
    });
  }

  save(form: NgForm) {
    if (form.valid) {
      var request = new ActionReq<InventoryStatusModel>({
        item: this.inventory_status,
      });
      this.is_loading = true;
      this.service
        .saveInventoryStatus(request)
        .subscribe(
          (resp) => {
            if (resp) {
              if (this.is_edit == false)
                this.inventory_status = new InventoryStatusModel();
              this.toatr_service.success("Inventory Status saved successfully");
            }
          },
          (error) => {
            var message = "Error saving Inventory Status";
            if (_.has(error, "error.message")) {
              message = error.error.message;
            }
            this.toatr_service.error(message);
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
