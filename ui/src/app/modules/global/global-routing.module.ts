import { Routes, RouterModule } from "@angular/router";
import { GlobalComponent } from "./global.component";
import { NgModule } from "@angular/core";
import { PagenotfoundGlobalComponent } from "./containers/pagenotfound/pagenotfound.global.component";
import { LaunchGlobalComponent } from "./containers/launch/launch.global.component";

const global_routes: Routes = [
  {
    path: "launch",
    component: LaunchGlobalComponent,
  },
  {
    path: "**",
    component: PagenotfoundGlobalComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(global_routes)],
  exports: [RouterModule],
})
export class GlobalRoutingModule {}
