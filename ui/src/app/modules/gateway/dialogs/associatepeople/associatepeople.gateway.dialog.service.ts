import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { CableModel } from "../../models/cable.model";
import { CableDriverMapModel } from "../../models/cabledrivermap.model";
import { DevicePeopleModelCriteria } from '../../models/devicepeople.model';

@Injectable({
  providedIn: "root",
})
export class AssociatePeopleGatewayDialogService {
  private SERVER_URL = environment.license_manager_url;
  private SERVER_URL_GATEWAY = environment.gateway_base_url;
  constructor(private httpClient: HttpHelperAuthService) {}
  saveAssociation(request: ActionReq<DevicePeopleModelCriteria>) {
    return this.httpClient.post(
      `${this.SERVER_URL_GATEWAY}/api/v1/people/associate`,
      request
    );
  }
}
