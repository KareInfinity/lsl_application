import { Injectable } from "@angular/core";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { DeviceValues } from "../../models/devicevalues.model";

@Injectable({
  providedIn: "root",
})
export class DeviceNetworkHistoryService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) { }

  getDeviceNetworkValues(request: any, from_date: Date, to_date: Date) {
    return this.httpClient.post(
      `${
      this.SERVER_URL
      }/api/devicevalues/getDeviceNetworkValuesHistory?from_date=${from_date.toISOString()}&to_date=${to_date.toISOString()}`,
      request
    );
  }
}
