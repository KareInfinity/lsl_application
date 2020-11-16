import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHelperAuthService } from 'src/app/modules/auth/service/httphelper/httphealper.auth.service';
import { ActionReq } from 'src/app/modules/global/models/actionreq.model';
import { CableModel } from '../../models/cable.model';

@Injectable({
  providedIn: 'root'
})
export class CableGatewayService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) { }

  getCableList() {
    return this.httpClient.get(`${this.SERVER_URL}/api/cable/`);
  }

  saveCable(post_data: ActionReq<CableModel>) {
    if (post_data.item.id == 0) {
      return this.httpClient.post(`${this.SERVER_URL}/api/cable`, post_data);
    } else {
      return this.httpClient.put(`${this.SERVER_URL}/api/cable`, post_data);
    }
  }

}
