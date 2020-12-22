import { Injectable } from "@angular/core";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { DeviceValues } from "../../models/devicevalues.model";
import { DeviceBatteryValuesCriteria } from "../../models/devicebatteryvalues.model";
import { DeviceInventoryStatusModel } from '../../models/inventorystatus.model';

@Injectable({
  providedIn: "root",
})
export class DeviceInventoryStatusHistoryService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) {}

  getDeviceInventoryStatus(request: ActionReq<DeviceInventoryStatusModel>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/deviceinventorystatus/get`,
      request
    );
  }
}
