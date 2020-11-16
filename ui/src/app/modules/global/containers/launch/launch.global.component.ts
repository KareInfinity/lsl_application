import { Component, OnInit } from "@angular/core";
import { LaunchGlobalService } from "./launch.global.service";
import { ToastrService } from "ngx-toastr";
import { ActionReq } from "../../models/actionreq.model";
import { Settings } from "../../models/settings.model";
import { ActionRes } from "../../models/actionres.model";
import { StorageGlobalService } from "../../service/storage/storage.global.service";
import { Router } from "@angular/router";
import { StorageAuthService } from "src/app/modules/auth/service/storage/storage.auth.service";
import { User } from "src/app/modules/auth/models/user.model";

@Component({
  selector: "global-launch",
  templateUrl: "./launch.global.componet.html",
  styleUrls: ["./launch.global.component.scss"],
})
export class LaunchGlobalComponent implements OnInit {
  constructor(
    private service: LaunchGlobalService,
    private toastr_service: ToastrService,
    private global_storage: StorageGlobalService,
    private auth_storage: StorageAuthService,
    private router: Router
  ) {}
  ngOnInit() {
    this.getData();
  }
  getData() {
    var user_data_str = localStorage.getItem("user_data");
    try {
      this.auth_storage.user = JSON.parse(user_data_str);
    } catch (error) {
      this.auth_storage.user = new User();
    }
    var request = new ActionReq<Settings>({
      item: new Settings(),
    });
    this.service.getSettings(request).subscribe(
      (resp: ActionRes<Settings>) => {
        if (resp.item) {
          this.global_storage.settings = resp.item;
          var redirect_url = this.global_storage.redirect_url;
          if (redirect_url.length > 0) {
            this.router.navigateByUrl(redirect_url);
          } else {
            this.router.navigateByUrl("/");
          }
        }
      },
      (err) => {
        this.toastr_service.error("Error getting settings");
      }
    );
  }
}
