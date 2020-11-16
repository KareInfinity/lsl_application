import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import * as _ from "lodash";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { DeviceModel, DeviceModelCriteria } from "../../models/device.model";

@Injectable({
  providedIn: "root",
})
export class DeviceDataGatewayService {
  private SERVER_URL = environment.gateway_base_url;
  constructor(private httpClient: HttpHelperAuthService) {}
  getDeviceList(request: ActionReq<DeviceModelCriteria>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/v1/devices/dashboard`,
      request
    );
  }
}
