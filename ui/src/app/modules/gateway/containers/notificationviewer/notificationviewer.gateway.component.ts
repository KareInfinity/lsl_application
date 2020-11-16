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
} from "angular-slickgrid";
import { ToastrService } from "ngx-toastr";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import * as moment from "moment";
import * as _ from "lodash";
import { Router, ActivatedRoute } from "@angular/router";
import { Action } from "rxjs/internal/scheduler/Action";
import { NotificationViewerService } from "./notificationviewer.gateway.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { forkJoin } from "rxjs";

@Component({
  selector: "gateway-notificationviewer",
  templateUrl: "./notificationviewer.gateway.component.html",
  styleUrls: ["./notificationviewer.gateway.component.css"],
})
export class NotificationViewerGatewayComponent implements OnInit {
  constructor(
    private service: NotificationViewerService,
    private toastr_service: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getData();
  }
  getData() {
    this.is_loading = true;
    forkJoin([
      this.service.getNotificationManagerViewerUrl(),
      this.service.getHMAC(),
    ])
      .subscribe(
        (resp_arr: Array<any>) => {
          this.hmac = resp_arr[1].item;

          this.notification_url = this.sanitizer.bypassSecurityTrustResourceUrl(
            resp_arr[0].item
          );
        },
        (err) => {
          var message = "Error getting Notification Viewer info";
          if (_.has(err, "error.message")) {
            message = err.error.message;
          }
          this.toastr_service.error(message);
        }
      )
      .add(() => {
        this.is_loading = false;
      });
  }
  is_loading: boolean = false;
  hmac: string = "";
  notification_url: SafeUrl | null = null;
  onNotificationLoadSuccess(url, e) {
    console.log(url);

    var iframe = document.getElementById("notification-iframe");
    var iWindow = iframe ? (<HTMLIFrameElement>iframe).contentWindow : null;
    if (iWindow) {
      var accesstoken = this.hmac;
      setTimeout(() => {
        iWindow.postMessage(
          { accesstoken },
          url.changingThisBreaksApplicationSecurity
        );
      },1000);
    }
  }
}
