import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
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
import { StorageAuthService } from "../../service/storage/storage.auth.service";
import { ApiAuthService } from "../../service/api/api.auth.service";
import { switchMap, catchError } from "rxjs/operators";
import { of, Observable } from "rxjs";
import { StorageGlobalService } from "src/app/modules/global/service/storage/storage.global.service";
@Injectable({
  providedIn: "root",
})
export class UserAuthGuard implements CanActivate, CanLoad {
  constructor(
    public router: Router,
    public jwtHelper: JwtHelperService,
    public auth_storage: StorageAuthService,
    public user_auth_service: ApiAuthService,
    public global_storage: StorageGlobalService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    let url: string = state.url;
    return this.checkLogin(url);
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    let url = _.reduce(
      segments,
      (path, current_segment, index) => {
        return `${path}/${current_segment.path}`;
      },
      ""
    );
    return this.checkLogin(url);
  }
  // canLoad(route: Route): Observable<boolean> {
  //   let url = `/${route.path}`;

  //   return this.checkLogin(url);
  // }
  checkLogin(url) {
    if (this.global_storage.settings.auth == false) {
      return of(true);
    }
    if (!this.user_auth_service.isAuthenticated()) {
      this.auth_storage.redirect_url = url;

      return this.user_auth_service.refreshAccessToken().pipe(
        switchMap((token: any) => {
          if (token) return of(true);
          else {
            this.user_auth_service.logout();
            return of(false);
          }
        }),
        catchError((err: any) => {
          this.user_auth_service.logout();
          return of(false);
        })
      );
    }
    return of(true);
  }
}
