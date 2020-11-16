import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHelperAuthService } from 'src/app/modules/auth/service/httphelper/httphealper.auth.service';
import { ActionReq } from 'src/app/modules/global/models/actionreq.model';
import { DriverModel } from '../../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverGatewayService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) { }

  getDriverList() {
    return this.httpClient.get(`${this.SERVER_URL}/api/driver`);
  }

  saveDriver(post_data: ActionReq<DriverModel>) {
    if (post_data.item.id == 0) {
      return this.httpClient.post(`${this.SERVER_URL}/api/driver`, post_data);
    } else {
      return this.httpClient.put(`${this.SERVER_URL}/api/driver`, post_data);
    }
  }
}
