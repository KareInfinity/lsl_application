import { Injectable } from "@angular/core";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { DeviceValues } from "../../models/devicevalues.model";
import { IDHSessionsModelCriteria } from "../../models/idhsessions.model";

@Injectable({
  providedIn: "root",
})
export class IdhSessionHistoryService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) {}

  getIdhSessionList(request: ActionReq<IDHSessionsModelCriteria>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/devicevalues/getIDHSessionsHistory`,
      request
    );
  }
}
