import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, Inject, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ISASHierarchyNode, NodeWithHierarchy } from "../../models/misc.model";
import {
  MatDialogRef,
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MAT_DIALOG_DATA,
} from "@angular/material";
import * as _ from "lodash";
import { forkJoin } from "rxjs";
import { ApiAuthService } from "src/app/modules/auth/service/api/api.auth.service";
import { StorageAuthService } from "src/app/modules/auth/service/storage/storage.auth.service";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { StorageGlobalService } from "src/app/modules/global/service/storage/storage.global.service";
import { ECHierarchyNode } from "../../models/misc.model";
import { PeopleModel } from "../../models/people.model";
import { ProfileGatewayDialogService } from "./selectfacility.gateway.dialog.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { Action } from "rxjs/internal/scheduler/Action";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "gateway-selectfacility-dialog",
  templateUrl: "./selectfacility.gateway.dialog.html",
  styleUrls: ["./selectfacility.gateway.dialog.scss"],
})
export class SelectFacilityGatewayDialog implements OnInit {
  constructor(
    public auth_storage: StorageAuthService,
    private auth_service: ApiAuthService,
    private global_storage: StorageGlobalService,
    public dialogRef: MatDialogRef<
      SelectFacilityGatewayDialog,
      boolean | ISASHierarchyNode
    >,
    private service: ProfileGatewayDialogService,
    private toastr_service: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: ISASHierarchyNode
  ) {}
  // people: PeopleModel = new PeopleModel();

  facilities: Array<string> = [];
  is_loading: boolean = false;
  node_list: Array<NodeWithHierarchy> = [];
  ngOnInit() {
    this.getData();
  }
  selectFacility(){};
  getData() {
    forkJoin([
      this.service.getECHierarchy(),
      this.service.getSiteTree(),
    ]).subscribe((resp_arr: Array<any>) => {
      var ec_node_list = [];
      var isas_node_list = [];
      if (_.has(resp_arr, "0.item")) {
        ec_node_list = resp_arr[0].item;
      }
      if (_.has(resp_arr, "1.item")) {
        isas_node_list = resp_arr[1].item;
      }
      this.node_list = this.getFacilitiesHavingPrivileges(
        ec_node_list,
        isas_node_list
      );
    });
  }
  isFacility(node_uid: string) {
    var is_facility = _.includes(this.facilities, node_uid);
    return is_facility;
  }
  cancel(): void {
    this.dialogRef.close(false);
  }
  ok(node: ISASHierarchyNode) {
    this.dialogRef.close(node);
  }
  logout() {
    this.auth_service.logout();
  }
  extractNodes(tree: Array<any>, extracted_nodes: Array<ECHierarchyNode> = []) {
    _.forEach(tree, (v) => {
      extracted_nodes.push(new ECHierarchyNode(v));
      if (v.children) {
        this.extractNodes(v.children, extracted_nodes);
      }
    });
    return extracted_nodes;
  }
  getHierarchy(
    node: ECHierarchyNode,
    node_list: Array<ECHierarchyNode>,
    hierarchy: Array<ECHierarchyNode> = []
  ) {
    if (node.ParentID != null) {
      var parent_node = _.find(node_list, { NodeID: node.ParentID });
      if (parent_node) {
        hierarchy.unshift(parent_node);
        this.getHierarchy(parent_node, node_list, hierarchy);
      }
    }
    return hierarchy;
  }
  getFacilityWithHierarchy(
    node_list: Array<ECHierarchyNode>
  ): Array<NodeWithHierarchy> {
    var facility_list = _.filter(node_list, (v) => {
      return v.TypeOf == "0";
    });
    var facility_with_hierarchy_list = _.map(facility_list, (v) => {
      var temp: NodeWithHierarchy = new NodeWithHierarchy();
      temp.node = v;
      temp.hierarchy = this.getHierarchy(v, node_list);
      temp.node_name = v.NodeName;
      var hierarchy_name_list = _.map(temp.hierarchy, (v) => {
        return v.NodeName;
      });
      temp.hierarchy_string = _.join(hierarchy_name_list, " > ");
      return temp;
    });
    return facility_with_hierarchy_list;
  }
  getFacilitiesHavingPrivileges(
    ec_node_list: Array<ECHierarchyNode>,
    isas_node_list: Array<ISASHierarchyNode>
  ) {
    var facility_list = this.getFacilityWithHierarchy(ec_node_list);
    var node_list_with_hierarchy = _.forEach(facility_list, (v) => {
      var isas_node = _.find(isas_node_list, { Uid: v.node.Uid });
      if (isas_node) {
        v.isas_node = isas_node;
      } else {
        v.isas_node = null;
      }
    });
    var node_list_with_hierarchy_having_privileges = _.filter(
      node_list_with_hierarchy,
      (v) => {
        return v.isas_node != null;
      }
    );
    return node_list_with_hierarchy_having_privileges;
  }
}
