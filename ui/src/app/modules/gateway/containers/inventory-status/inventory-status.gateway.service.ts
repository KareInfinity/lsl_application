import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { PeopleModel } from "../../models/people.model";
import { InventoryStatusModel } from "../../models/inventorystatus.model";

@Injectable({
  providedIn: "root",
})
export class InventoryStatusGatewayService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) {}

  getInventoryStatusList(request: ActionReq<InventoryStatusModel>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/Inventorystatus/get`,
      request
    );
  }
  deleteInventoryStatus(request: ActionReq<InventoryStatusModel>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/inventorystatus/delete`,
      request
    );
  }
}
