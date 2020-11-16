import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  CanLoad,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment,
} from "@angular/router";
import * as _ from "lodash";
import { StorageGlobalService } from "../../service/storage/storage.global.service";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class SettingsGlobalGuard implements CanActivate, CanLoad {
  constructor(
    public router: Router,
    private global_storage: StorageGlobalService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = state.url;
    return this.checkSettings(url);
  }
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    let url = _.reduce(
      segments,
      (path, current_segment, index) => {
        return `${path}/${current_segment.path}`;
      },
      ""
    );
    return this.checkSettings(url);
  }
  // canLoad(route: Route): boolean {
  //   let url = `/${route.path}`;

  //   return this.checkSettings(url);
  // }
  checkSettings(url) {
    var settings = this.global_storage.settings;
    if (settings == null) {
      this.global_storage.redirect_url = url;
      this.router.navigateByUrl("/launch");
      return false;
    }
    return true;
  }
}
