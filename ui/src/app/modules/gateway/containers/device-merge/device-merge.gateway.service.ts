import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { DeviceModel } from "../../models/device.model";

@Injectable({
  providedIn: "root",
})
export class DeviceMergeService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) {}

  saveDevice(request: ActionReq<DeviceModel>) {
    if (request.item.id == 0) {
      return this.httpClient.post(
        `${this.SERVER_URL}/api/v1/devices/save`,
        request
      );
    } else {
      return this.httpClient.put(
        `${this.SERVER_URL}/api/v1/devices/save`,
        request
      );
    }
  }
  getDevice(request: ActionReq<DeviceModel>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/v1/devices/get`,
      request
    );
  }

  // saveCable(post_data: ActionReq<DeviceModel>) {
  //   if (post_data.item.id == 0) {
  //     return this.httpClient.post(`${this.SERVER_URL}/api/v1/devices`, post_data);
  //   } else {
  //     return this.httpClient.put(`${this.SERVER_URL}/api/v1/devices`, post_data);
  //   }
  // }
}
