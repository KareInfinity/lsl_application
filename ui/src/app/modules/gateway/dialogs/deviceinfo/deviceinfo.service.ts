import { Injectable } from "@angular/core";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import {
  CustomDeviceValues,
  DeviceValues,
} from "../../models/devicevalues.model";

@Injectable({
  providedIn: "root",
})
export class DeviceinfoService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) {}

  getDeviceValues(request: ActionReq<CustomDeviceValues>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/devicevalues/getDeviceValuesHistory`,
      request
    );
  }
}
