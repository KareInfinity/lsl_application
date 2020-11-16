import { NgModule, ModuleWithProviders } from "@angular/core";
/* module */
import { GlobalModule } from "../global/global.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginAuthComponent } from "./containers/login/login.auth.component";
import { AuthComponent } from "./auth.component";
import { HttpHelperAuthService } from "./service/httphelper/httphealper.auth.service";
import { StorageAuthService } from "./service/storage/storage.auth.service";
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorAuthService } from './service/httpinterceptor/httpinterceptor.auth.service';
/* ui */

@NgModule({
  declarations: [
    /* ui */
    AuthComponent,
    LoginAuthComponent,
  ],
  imports: [
    /* modules */
    AuthRoutingModule,
    GlobalModule,
  ],
  exports: [],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        HttpHelperAuthService,
        StorageAuthService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpInterceptorAuthService,
          multi: true,
        },
      ],
    };
  }
}
