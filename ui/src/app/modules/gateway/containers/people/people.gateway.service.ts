import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHelperAuthService } from 'src/app/modules/auth/service/httphelper/httphealper.auth.service';
import { ActionReq } from 'src/app/modules/global/models/actionreq.model';
import { PeopleModel } from '../../models/people.model';

@Injectable({
  providedIn: "root",
})
export class PeopleGatewayService {
  private SERVER_URL = environment.gateway_base_url;

  constructor(private httpClient: HttpHelperAuthService) {}

  // getPeopleList() {
  //   return this.httpClient.get(`${this.SERVER_URL}/api/v1/people/`);
  // }
  getPeopleList(request: ActionReq<PeopleModel>, query: string) {
    return this.httpClient.post(
      `${this.SERVER_URL}/api/v1/people/get?${query}`,
      request
    );
  }
}
