import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { LoginAuthComponent } from "./containers/login/login.auth.component";
import { SettingsGlobalGuard } from "../global/guards/settings/settings.global.guard";

const auth_routes: Routes = [
  {
    path: "auth",
    component: AuthComponent,
    children: [
      {
        path: "login",
        component: LoginAuthComponent,
        canActivate: [SettingsGlobalGuard],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(auth_routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
