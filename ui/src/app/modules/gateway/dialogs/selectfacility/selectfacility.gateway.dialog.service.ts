import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { CableModel } from "../../models/cable.model";
import { CableDriverMapModel } from "../../models/cabledrivermap.model";
import { DevicePeopleModelCriteria } from "../../models/devicepeople.model";
import { PeopleModel } from '../../models/people.model';

@Injectable({
  providedIn: "root",
})
export class ProfileGatewayDialogService {
  private SERVER_URL = environment.gateway_base_url;
  constructor(private httpClient: HttpHelperAuthService) {}
  getECHierarchy() {
    return this.httpClient.get(`${this.SERVER_URL}/api/misc/ECHierarchy`);
  }
  getSiteTree() {
    return this.httpClient.get(
      `${this.SERVER_URL}/api/misc/ISASSitePermission`
    );
  }
  updatePeople(req: ActionReq<PeopleModel>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/v1/people/update`,
      req
    );
  }
}
