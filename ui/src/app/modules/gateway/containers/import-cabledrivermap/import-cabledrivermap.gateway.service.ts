import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpHelperAuthService } from "src/app/modules/auth/service/httphelper/httphealper.auth.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { CableDriverMapModelCriteria } from '../../models/cabledrivermap.model';

@Injectable({
  providedIn: "root",
})
export class ImportCablesService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) {}

  saveBulk(request: ActionReq<Array<CableDriverMapModelCriteria>>) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/cabledrivermap/savebulk`,
      request
    );
  }
}
