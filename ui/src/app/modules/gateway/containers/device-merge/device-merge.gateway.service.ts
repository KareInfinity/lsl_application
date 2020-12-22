import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { DeviceModel } from "../../models/device.model";
import { InventoryStatusModel } from "../../models/inventorystatus.model";
import { DevicePeopleModel } from "../../models/devicepeople.model";

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
  getInventoryStatusList() {
    var request = new ActionReq<InventoryStatusModel>({
      item: new InventoryStatusModel(),
    });
    return this.httpClient.post(
      `${this.SERVER_URL}/api/Inventorystatus/get`,
      request
    );
  }
  getECHierarchy() {
    return this.httpClient.get(`${this.SERVER_URL}/api/misc/ECHierarchy`);
  }
  getSiteTree() {
    return this.httpClient.get(
      `${this.SERVER_URL}/api/misc/ISASSitePermission`
    );
  }
  getAssociation(device_id: number) {
    var request = new ActionReq<DevicePeopleModel>({
      item: new DevicePeopleModel({
        device_id,
        is_active: true,
      }),
    });
    return this.httpClient.post(
      `${this.SERVER_URL}/api/v1/people/getassociations`,
      request
    );
  }
  
}
