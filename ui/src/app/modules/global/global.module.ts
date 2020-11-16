import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { GlobalRoutingModule } from "./global-routing.module";
// third party components
import { AngularSlickgridModule } from "angular-slickgrid";
import { NgSelectModule } from "@ng-select/ng-select";
import { ChartsModule } from "ng2-charts";
// material
import { MatSliderModule } from "@angular/material/slider";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatTabsModule, MatTabLink } from "@angular/material/tabs";
import { MatTreeModule } from "@angular/material/tree";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatRadioModule } from "@angular/material/radio";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";
import { MatBadgeModule } from "@angular/material/badge";
import { MatDividerModule } from "@angular/material/divider";
import { MatRippleModule } from "@angular/material/core";
import { DragDropModule } from "@angular/cdk/drag-drop";
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from "@angular-material-components/datetime-picker";

/* ui */
import { PagenotfoundGlobalComponent } from "./containers/pagenotfound/pagenotfound.global.component";
import { StorageGlobalService } from "./service/storage/storage.global.service";
import { LaunchGlobalComponent } from './containers/launch/launch.global.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalComponent } from './global.component';

@NgModule({
  declarations: [
    /* ui */
    PagenotfoundGlobalComponent,
    LaunchGlobalComponent,
    GlobalComponent
  ],
  imports: [
    // angular components
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    HttpClientModule,
    // third party components
    AngularSlickgridModule,
    NgSelectModule,
    // material
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatTreeModule,
    MatCheckboxModule,
    MatTableModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatExpansionModule,
    MatCardModule,
    MatBadgeModule,
    MatDividerModule,
    ChartsModule,
    MatRippleModule,
    DragDropModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    /* modules */
    GlobalRoutingModule,
  ],
  exports: [
    // angular components
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    HttpClientModule,
    // third party components
    AngularSlickgridModule,
    NgSelectModule,
    // material
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatTreeModule,
    MatCheckboxModule,
    MatTableModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatExpansionModule,
    MatCardModule,
    MatBadgeModule,
    MatDividerModule,
    ChartsModule,
    MatRippleModule,
    DragDropModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    /* ui */
    PagenotfoundGlobalComponent,
    LaunchGlobalComponent,
  ],
})
export class GlobalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GlobalModule,
      providers: [StorageGlobalService],
    };
  }
}
