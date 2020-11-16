import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { switchMap } from "rxjs/operators";

import { throwError, of } from "rxjs";

import * as _ from "lodash";
import { HttpHelperAuthService } from "../httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { Auth } from "../../models/auth.model";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { ErrorResponse } from "src/app/modules/global/models/errorres.model";
import { StorageAuthService } from "../storage/storage.auth.service";
@Injectable({
  providedIn: "root",
})
export class ApiAuthService {
  private SERVER_URL = environment.auth_base_url;
  constructor(
    public jwtHelper: JwtHelperService,
    public router: Router,
    private httpClient: HttpHelperAuthService,
    private auth_storage: StorageAuthService
  ) {}

  public isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if (token !== null) {
      return true;
    } else return false;
  }
  logout() {
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("token");
    this.router.navigate(["/auth/login"]);
  }
  public login(request: ActionReq<Auth>) {
    return this.httpClient.post(
      this.SERVER_URL + "/api/user/login",
      request,
      true
    );
  }
  public refreshAccessToken() {
    var refresh_token = localStorage.getItem("refresh_token");
    var request = new ActionReq<Auth>({
      item: new Auth({
        refresh_token,
      }),
    });
    return this.httpClient
      .post(this.SERVER_URL + "/api/user/token", request, true)
      .pipe(
        switchMap((resp: ActionRes<Auth>) => {
          if (_.get(resp, "item.refresh_token", "") == "") {
            throwError(
              new ErrorResponse({
                message: "Error refreshing token",
              })
            );
          }
          localStorage.setItem("token", resp.item.access_token);
          return of(resp.item.refresh_token);
        })
      );
  }
  getAccessToken() {
    var token = localStorage.getItem("token");
    return token;
  }
}
