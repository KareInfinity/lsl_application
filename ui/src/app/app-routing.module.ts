import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SettingsGlobalGuard } from './modules/global/guards/settings/settings.global.guard';
import { UserAuthGuard } from './modules/auth/guards/user/user.auth.guard';
// Screens

const appRoutes: Routes = [
  { path: "", redirectTo: "lifeshield", pathMatch: "full" },
  {
    path: "lifeshield",
    loadChildren: () =>
      import("./modules/gateway/gateway.module").then(
        (mod) => mod.GatewayModule
      ),
    // data: { preload: true },
    canLoad: [SettingsGlobalGuard, UserAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
