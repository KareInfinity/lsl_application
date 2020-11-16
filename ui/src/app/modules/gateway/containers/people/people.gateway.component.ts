import { Component, OnInit } from "@angular/core";
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
  OnEventArgs,
  Formatters,
  GridOdataService,
  OdataOption,
} from "angular-slickgrid";
import { AssociatePeopleGatewayDialog } from "../../dialogs/associatepeople/associatepeople.gateway.dialog";
import { MatDialog } from "@angular/material";
import * as moment from "moment";
import * as _ from "lodash";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { PeopleGatewayService } from "./people.gateway.service";
import { PeopleModel } from "../../models/people.model";
import { ToastrService } from "ngx-toastr";
import { UserAssociationLogsGatewayDialog } from "../../dialogs/userassociationlogs/userassociationlogs.gateway.dialog";
import { PatientAssociationLogsGatewayDialog } from "../../dialogs/patientassociationlogs/patientassociationlogs.gateway.dialog";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";

@Component({
  selector: "gateway-people",
  templateUrl: "./people.gateway.component.html",
  styleUrls: ["./people.gateway.component.scss"],
})
export class PeopleGatewayComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private peopleService: PeopleGatewayService,
    private toastr_service: ToastrService
  ) {}
  ngOnInit() {
    // this.getData();
    this.setupPeopleListGrid();
  }
  is_loading: boolean = false;
  /* slick grid */
  people_list_angular_grid: AngularGridInstance;
  people_list_grid: any;
  people_list_grid_service: GridService;
  people_list_grid_data_view: any;
  people_list_grid_column_definitions: Column[];
  people_list_grid_options: GridOption;
  people_list_grid_dataset: Array<PeopleModel>;
  people_list_grid_updated_object: any;

  // getData() {
  //   this.is_loading = true;
  //   this.peopleService
  //     .getPeopleList()
  //     .subscribe(
  //       (resp: ActionRes<Array<PeopleModel>>) => {
  //         if (resp.item) {
  //           // var data = _.forEach(resp.item, (v, k) => {
  //           //   v.id = k;
  //           // });
  //           this.people_list_grid_dataset = resp.item;
  //         }
  //       },
  //       (err) => {
  //         this.toastr_service.error("Error getting People");
  //       }
  //     )
  //     .add(() => {
  //       this.is_loading = false;
  //     });
  // }
  openAssociateDialog(): void {
    const dialogRef = this.dialog.open(AssociatePeopleGatewayDialog, {
      width: "20vw",
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  /* slick grid */
  peopleListGridReady(angularGrid: AngularGridInstance) {
    this.people_list_angular_grid = angularGrid;
    this.people_list_grid_data_view = angularGrid.dataView;
    this.people_list_grid = angularGrid.slickGrid;
    this.people_list_grid_service = angularGrid.gridService;
  }
  async onPeopleListGridCellChanged(e, args) {
    this.people_list_grid_updated_object = args.item;
    // this.people_list_angular_grid.resizerService.resizeGrid(10);
  }
  setupPeopleListGrid() {
    this.people_list_grid_column_definitions = [
      // {
      //   name: "#",
      //   field: "",
      //   id: "",
      //   formatter: function (row) {
      //     return (row + 1).toString();
      //   },
      //   minWidth: 50,
      //   maxWidth: 50,
      // },
      {
        id: "people_id",
        name: "People ID",
        field: "people_id",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        name: "",
        field: "id",
        id: "id",
        formatter: Formatters.infoIcon,
        minWidth: 50,
        toolTip: "Show association history",
        //maxWidth: 50,
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          var people_type = args.dataContext.people_type;
          if (people_type == "PATIENT") {
            this.showPeopleAssociationLogsPopup(e, args);
          } else {
            this.showUserAssociationLogsPopup(e, args);
          }
        },
      },
      {
        id: "people_type",
        name: "People Type",
        field: "people_type",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "first_name",
        name: "First Name",
        field: "first_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "middle_name",
        name: "Middle Name",
        field: "middle_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "last_name",
        name: "Last Name",
        field: "last_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "people_class",
        name: "People Class",
        field: "people_class",
        type: FieldType.string,
        sortable: true,
        minWidth: 80,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "is_registered",
        name: "Is Registered",
        field: "is_registered",
        type: FieldType.boolean,
        sortable: true,
        minWidth: 90,
        // filterable: true,
        // filter: { model: Filters.input },
      },
      {
        id: "is_discharged",
        name: "Is Discharged",
        field: "is_discharged",
        type: FieldType.boolean,
        sortable: true,
        minWidth: 90,
        // filterable: true,
        // filter: { model: Filters.input },
      },
      {
        id: "point_of_care",
        name: "Point of Care",
        field: "point_of_care",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "room",
        name: "Room",
        field: "room",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        filterable: true,
        filter: { model: Filters.input },
      },
      {
        id: "bed",
        name: "Bed",
        field: "bed",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        // filterable: true,
        // filter: { model: Filters.input },
      },
      {
        id: "facility",
        name: "Facility",
        field: "facility",
        type: FieldType.string,
        sortable: true,
        minWidth: 120,
        // filterable: true,
        // filter: { model: Filters.input },
      },
    ];
    this.people_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "people-list-grid-container",
        sidePadding: 15,
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableFiltering: true,
      pagination: {
        pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: 10,
        totalItems: 0,
      },
      presets: {
        filters: [
          // {
          //   columnId: "is_commissioned",
          //   searchTerms: ["true"],
          //   operator: OperatorType.equal,
          // },
        ],
        // you can also type operator as string, e.g.: operator: 'EQ'
        pagination: { pageNumber: 1, pageSize: 20 },
      },
      backendServiceApi: {
        service: new GridOdataService(),
        options: {
          enableCount: true, // add the count in the OData query, which will return a property named "odata.count" (v2) or "@odata.count" (v4)
          version: 2, // defaults to 2, the query string is slightly different between OData 2 and 4
        } as OdataOption,
        preProcess: () => {
          this.is_loading = true;
        },
        process: (query) => this.getData(query),
        postProcess: (response) => {
          this.people_list_grid_dataset = response.item;
          this.people_list_grid_options.pagination.totalItems =
            response["total_count"];
          this.people_list_grid_options = Object.assign(
            {},
            this.people_list_grid_options
          );
          this.is_loading = false;
        },
        onError: (e) => {
          console.log("error", e);
          this.is_loading = false;
        },
      },
    };
  }
  showUserAssociationLogsPopup = (e, args: OnEventArgs) => {
    const alert = this.dialog.open(UserAssociationLogsGatewayDialog, {
      height: "90vh",
      width: "90vw",
      data: {
        user_id: args.dataContext.id,
        user_fullname: args.dataContext.first_name,
        user_external_id: args.dataContext.people_id,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
  showPeopleAssociationLogsPopup = (e, args: OnEventArgs) => {
    const alert = this.dialog.open(PatientAssociationLogsGatewayDialog, {
      height: "90vh",
      width: "90vw",
      data: {
        people_id: args.dataContext.id,
        people_fullname: args.dataContext.first_name,
        people_external_id: args.dataContext.people_id,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
  getData(query: string) {
    console.log(query);
    var query_object: any = {};
    _.forEach(query.split("&"), (v) => {
      var [key, value] = v.split("=");
      query_object[key] = value;
    });
    var skip: number = parseInt(_.get(query_object, "$skip", "0"));
    var top: number = parseInt(_.get(query_object, "$top", "0"));
    var page: number = skip / top + 1;
    var filter_obj: any = this.transformFilterAsObject(
      _.get(query_object, "$filter", "")
    );
    var people = new PeopleModel();
    if (_.has(filter_obj, "people_id")) {
      people.people_id = filter_obj["people_id"];
    }
    if (_.has(filter_obj, "people_type")) {
      people.people_type = filter_obj["people_type"];
    }
    if (_.has(filter_obj, "first_name")) {
      people.first_name = filter_obj["first_name"];
    }
    if (_.has(filter_obj, "middle_name")) {
      people.middle_name = filter_obj["middle_name"];
    }
    if (_.has(filter_obj, "last_name")) {
      people.last_name = filter_obj["last_name"];
    }
    if (_.has(filter_obj, "people_class")) {
      people.people_class = filter_obj["people_class"];
    }
    if (_.has(filter_obj, "point_of_care")) {
      people.point_of_care = filter_obj["point_of_care"];
    }
    if (_.has(filter_obj, "room")) {
      people.room = filter_obj["room"];
    }

    // if (_.has(filter_obj, "is_commissioned")) {
    //   device.is_commissioned =
    //     filter_obj["is_commissioned"] == "true" ? true : false;
    // }

    var request = new ActionReq<PeopleModel>({
      item: people,
    });

    query = `page=${page}&size=${top}`;
    return this.peopleService.getPeopleList(request, query);
  }
  transformFilterAsObject(filter: string) {
    var sub_string_regex = /substringof\('(?<value>\w+)', (?<key>\w+)\)/;
    var filter_array = filter.split("and");
    var filter_obj: any = {};
    _.forEach(filter_array, (v) => {
      var extracted: any = v.match(sub_string_regex);
      if (extracted && extracted["groups"])
        filter_obj[extracted.groups["key"].toLowerCase()] =
          extracted.groups["value"];
    });
    var boolean_regex = /(?<key>\w+) eq (?<value>\w+)/;
    _.forEach(filter_array, (v) => {
      var extracted: any = v.match(boolean_regex);
      if (extracted && extracted["groups"])
        filter_obj[extracted.groups["key"].toLowerCase()] =
          extracted.groups["value"];
    });
    return filter_obj;
  }
  resetGrid() {
    var current_filters = this.people_list_angular_grid.filterService.getCurrentLocalFilters();
    // this.device_list_angular_grid.gridService.resetGrid();
    this.people_list_angular_grid.filterService.updateFilters(current_filters);
  }
}
