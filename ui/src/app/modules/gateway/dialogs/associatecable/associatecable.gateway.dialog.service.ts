import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { CableModel } from "../../models/cable.model";
import { CableDriverMapModel } from "../../models/cabledrivermap.model";

@Injectable({
  providedIn: "root",
})
export class AssociateCableGatewayDialogService {
  private SERVER_URL = environment.license_manager_url;
  private SERVER_URL_GATEWAY = environment.gateway_base_url;
  constructor(private httpClient: HttpHelperAuthService) {}
  getCableList() {
    return this.httpClient.get(`${this.SERVER_URL_GATEWAY}/api/cable/`);
  }
  getDriverList() {
    return this.httpClient.get(`${this.SERVER_URL_GATEWAY}/api/driver/`);
  }
  saveCableDriverMap(request: ActionReq<CableDriverMapModel>) {
    return this.httpClient.post(
      `${this.SERVER_URL_GATEWAY}/api/cabledrivermap`,
      request
    );
  }
}
