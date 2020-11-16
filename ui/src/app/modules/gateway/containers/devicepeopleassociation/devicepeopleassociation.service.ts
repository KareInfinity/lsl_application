import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { DevicePeopleModelCriteria } from "../../models/devicepeople.model";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";

@Injectable({
  providedIn: "root",
})
export class DevicePeopleAssociationGatewayService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) {}
  getAssociationList(request: ActionReq<DevicePeopleModelCriteria>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/v1/people/getassociations`,
      request
    );
  }
  dissociate(request: ActionReq<DevicePeopleModelCriteria>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/v1/people/dissociate`,
      request
    );
  }
}
