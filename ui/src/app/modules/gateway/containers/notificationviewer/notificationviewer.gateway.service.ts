import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";

@Injectable({
  providedIn: "root",
})
export class NotificationViewerService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) {}

  getNotificationManagerViewerUrl() {
    return this.httpClient.get(
      `${this.SERVER_URL}/api/misc/getNotificationManagerViewerUrl`
    );
  }
  getHMAC() {
    return this.httpClient.get(
      `${this.SERVER_URL}/api/misc/getHMAC`
    );
  }
  // getDeviceList(request: ActionReq<DeviceModel>, query: string) {
  //   return this.httpClient.post(
  //     `${this.SERVER_URL}/api/v1/devices/get?${query}`,
  //     request
  //   );
  // }

  // saveCable(post_data: ActionReq<DeviceModel>) {
  //   if (post_data.item.id == 0) {
  //     return this.httpClient.post(`${this.SERVER_URL}/api/v1/devices`, post_data);
  //   } else {
  //     return this.httpClient.put(`${this.SERVER_URL}/api/v1/devices`, post_data);
  //   }
  // }
}
