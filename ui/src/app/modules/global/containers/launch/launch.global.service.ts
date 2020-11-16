import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { ActionReq } from "../../models/actionreq.model";
import { Settings } from "../../models/settings.model";
import { HttpHelperAuthService } from 'src/app/modules/auth/service/httphelper/httphealper.auth.service';

@Injectable({
  providedIn: "root",
})
export class LaunchGlobalService {
  private SERVER_URL = environment.global_base_url;
  constructor(private httpClient: HttpHelperAuthService) {}
  public getSettings(request: ActionReq<Settings>) {
    return this.httpClient.post(this.SERVER_URL + "/api/settings/get", request);
  }
}
