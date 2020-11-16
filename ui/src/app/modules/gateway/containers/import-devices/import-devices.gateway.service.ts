import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { DeviceModelCriteria } from "../../models/device.model";

@Injectable({
  providedIn: "root",
})
export class ImportDevicesService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) {}

  saveBulk(request: ActionReq<Array<DeviceModelCriteria>>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/v1/devices/savebulk`,
      request
    );
  }
}
