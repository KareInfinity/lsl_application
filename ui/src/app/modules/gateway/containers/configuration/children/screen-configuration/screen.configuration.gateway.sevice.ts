import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import * as _ from "lodash";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { AppSettingsModel } from "src/app/modules/gateway/models/appsettings.model";

@Injectable({
  providedIn: "root",
})
export class ScreenConfigurationGatewayService {
  private LM_SERVER_URL = environment.license_manager_url;
  private SERVER_URL = environment.gateway_base_url;
  constructor(private httpClient: HttpHelperAuthService) {}
  getDeviceList() {
    return this.httpClient.get(
      `${this.SERVER_URL}/api/misc/ConfigurationDeviceList`
    );
  }
  getSiteTree() {
    return this.httpClient.get(
      `${this.SERVER_URL}/api/misc/ISASSitePermission`
    );
  }
  getCableDriverMapList() {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/cabledrivermap/get`,
      {}
    );
  }
  getAppSetting() {
    var request = new ActionReq<AppSettingsModel>({
      item: new AppSettingsModel({
        type: AppSettingsModel.types.LSL_PAGES,
      }),
    });
    return this.httpClient.post(
      `${this.SERVER_URL}/api/appsettings/get`,
      request
    );
  }
  saveAppSettings(req: ActionReq<AppSettingsModel>) {
    return this.httpClient.post(`${this.SERVER_URL}/api/appsettings/save`, req);
  }
}
