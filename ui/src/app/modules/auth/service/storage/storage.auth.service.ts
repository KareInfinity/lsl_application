import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { User } from '../../models/user.model';
@Injectable({
  providedIn: "root",
})
export class StorageAuthService {
  redirect_url: string = "";
  user : User = new User()
  constructor(private router: Router) {}

}
