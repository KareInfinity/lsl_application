import { Component } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { ApiAuthService } from "../../service/api/api.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { Auth } from "../../models/auth.model";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { StorageAuthService } from "../../service/storage/storage.auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "auth-login",
  templateUrl: "./login.auth.component.html",
  styleUrls: ["./login.auth.component.scss"],
})
export class LoginAuthComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private api_auth_service: ApiAuthService,
    private auth_storage: StorageAuthService,
    private router: Router,
    private toastr_service: ToastrService
  ) {}
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    var request = new ActionReq<Auth>({
      item: new Auth({
        param_1: this.loginForm.value.username,
        param_2: this.loginForm.value.password,
      }),
    });
    this.api_auth_service
      .login(request)
      .subscribe(
        (resp: ActionRes<Auth>) => {
          if (resp.item) {
            localStorage.setItem("token", resp.item.access_token);
            localStorage.setItem("refresh_token", resp.item.refresh_token);
            localStorage.setItem("user_data",JSON.stringify(resp.item.user))
            this.auth_storage.user = resp.item.user;
            if (this.auth_storage.redirect_url.length > 0) {
              this.router.navigateByUrl(this.auth_storage.redirect_url);
            } else {
              this.router.navigateByUrl("/");
            }
          }
        },
        (err) => {
          this.toastr_service.error("Authentication Failed");
        }
      )
      .add(() => {
        this.loading = false;
      });
  }
}
