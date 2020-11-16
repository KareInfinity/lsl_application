import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { Settings } from "../../models/settings.model";
@Injectable({
  providedIn: "root",
})
export class StorageGlobalService {
  _settings: Settings | null = null;
  _redirect_url: string = "";
  constructor(private router: Router) {}
  set settings(value: Settings) {
    this._settings = value;
  }
  get settings() {
    return this._settings;
  }
  set redirect_url(value: string) {
    this._redirect_url = value;
  }
  get redirect_url() {
    return this._redirect_url;
  }
}
