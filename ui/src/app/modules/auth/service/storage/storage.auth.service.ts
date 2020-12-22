import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { PeopleModel } from "src/app/modules/gateway/models/people.model";
@Injectable({
  providedIn: "root",
})
export class StorageAuthService {
  redirect_url: string = "";
  private _people: PeopleModel = new PeopleModel();
  constructor(private router: Router) {}
  set people(value: PeopleModel) {
    localStorage.setItem("people_data", JSON.stringify(value));
    this._people = value;
  }
  get people() {
    return this._people;
  }
}
