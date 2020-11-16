import { Injectable } from "@angular/core";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { DeviceValues } from "../../models/devicevalues.model";
import { DevicePeopleModelCriteria } from '../../models/devicepeople.model';

@Injectable({
  providedIn: "root",
})
export class DeviceAssociationGatewayService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) { }
  getAssociationList(request: ActionReq<DevicePeopleModelCriteria>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/v1/people/getassociations`,
      request
    );
  }
}
