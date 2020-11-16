// Angular Imports
import { BrowserModule, Title } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

// material imports

// routing module
import { AppRoutingModule } from "./app-routing.module";

// auth

// components
import { ToastrModule } from "ngx-toastr";
import { AngularSlickgridModule } from "angular-slickgrid";


// screens
import { AppComponent } from "./app.component";
import { GlobalModule } from "./modules/global/global.module";
import { AuthModule } from './modules/auth/auth.module';
// import { CustomActionFormatterComponent } from './modules/gateway/containers/devices/custom-actionFormatter.component';
// import { CustomActionFormatterComponent } from './modules/gateway/containers/devices/custom-actionFormatter.component';

// modules

@NgModule({
  declarations: [
    // Screens
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AngularSlickgridModule.forRoot(),
    // modules
    AppRoutingModule,
    AuthModule.forRoot(),
    GlobalModule.forRoot(),
  ],
  providers: [Title],
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
