import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { DeviceModel } from "../../models/device.model";
import { InventoryStatusModel } from "../../models/inventorystatus.model";

@Injectable({
  providedIn: "root",
})
export class InventoryStatusMergeService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) {}

  saveInventoryStatus(request: ActionReq<InventoryStatusModel>) {
    if (request.item.id == 0) {
      return this.httpClient.post(
        `${this.SERVER_URL}/api/inventorystatus/save`,
        request
      );
    } else {
      return this.httpClient.put(
        `${this.SERVER_URL}/api/inventorystatus/save`,
        request
      );
    }
  }
  getInventoryStatus(request: ActionReq<InventoryStatusModel>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/inventorystatus/get`,
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
