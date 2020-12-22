import { Component, OnInit } from "@angular/core";
import {
  DeviceModel,
  DeviceModelCriteria,
  DeviceSoftwareVersionCriteria,
} from "../../models/device.model";
import * as _ from "lodash";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { DeviceMergeService } from "./device-merge.gateway.service";
import { ActionReq } from "src/app/modules/global/models/actionreq.model";
import { ToastrService } from "ngx-toastr";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import { Action } from "rxjs/internal/scheduler/Action";
import { forkJoin, Observable } from "rxjs";
import { InventoryStatusModel } from "../../models/inventorystatus.model";
import { MatDialog } from "@angular/material";
import { DeviceInventoryStatusHistoryDialog } from "../../dialogs/deviceinventorystatushistory/deviceinventorystatushistory.gateway.dialog";
import { OnEventArgs } from "angular-slickgrid";
import { DeviceNetworkHistoryDialog } from "../../dialogs/devicenetworkhistory/devicenetworkhistory.component";
import { DeviceBatteryStatusHistoryDialog } from "../../dialogs/devicebatteystatushistory/devicebatterystatushistory.component";
import { SoftwareVersionHistoryDialog } from "../../dialogs/softwareversionhistory/softwareversionhistory.gateway.dialog";
import { DeviceLastSeenHistoryDialog } from "../../dialogs/devicelastseenhistory/devicelastseenhistory.gateway.dialog";
import { DeviceAssociationLogsGatewayDialog } from "../../dialogs/deviceassociationlogs/deviceassociationlogs.gateway.dialog";
import { SelectFacilityGatewayDialog } from "../../dialogs/selectfacility/selectfacility.gateway.dialog";
import {
  ECHierarchyNode,
  ISASHierarchyNode,
  NodeWithHierarchy,
} from "../../models/misc.model";
import {
  DevicePeopleModel,
  DevicePeopleModelCriteria,
} from "../../models/devicepeople.model";
import { AssociatePeopleGatewayDialog } from "../../dialogs/associatepeople/associatepeople.gateway.dialog";
import { StorageAuthService } from "src/app/modules/auth/service/storage/storage.auth.service";
@Component({
  selector: "gateway-device-merge",
  templateUrl: "./device-merge.gateway.component.html",
  styleUrls: ["./device-merge.gateway.component.scss"],
})
export class DeviceMergeGatewayComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: DeviceMergeService,
    private toatr_service: ToastrService,
    public dialog: MatDialog,
    private auth_storage: StorageAuthService
  ) {}
  ngOnInit() {
    this.getData();
  }
  is_loading: boolean = false;
  is_edit = false;
  is_inventorystatus_readonly: boolean = false;
  device: DeviceModelCriteria = new DeviceModelCriteria();
  inventory_status_list: Array<InventoryStatusModel> = [];
  device_type_list = [
    {
      feature_name: "IDH",
    },
    {
      feature_name: "IV Watch",
    },
    {
      feature_name: "DexcomG6",
    },
  ];
  device_images = {
    IDH: "assets/images/devices/idh.jpeg",
    "IV Watch": "assets/images/devices/iv_watch.jpeg",
    DexcomG6: "assets/images/devices/dexcom.jpeg",
  };
  node_list: Array<NodeWithHierarchy> = [];
  getData() {
    var params = this.route.snapshot.queryParams;

    var call_list: Array<Observable<any>> = [];

    call_list.push(
      this.service.getInventoryStatusList(),
      this.service.getECHierarchy(),
      this.service.getSiteTree()
    );

    if (_.get(params, "id", null) != null) {
      this.is_edit = true;
      var device_id = parseInt(params["id"]);
      var request = new ActionReq<DeviceModel>({
        item: new DeviceModel({ id: device_id }),
      });
      call_list.push(this.service.getDevice(request));

      /* get device active association */
      call_list.push(this.service.getAssociation(device_id));
    }

    this.is_loading = true;

    forkJoin(call_list)
      .subscribe(
        (resp_arr) => {
          this.inventory_status_list = resp_arr[0].item;
          var ec_node_list = [];
          var isas_node_list = [];
          if (_.has(resp_arr, "1.item")) {
            ec_node_list = resp_arr[1].item;
          }
          if (_.has(resp_arr, "2.item")) {
            isas_node_list = resp_arr[2].item;
          }
          this.node_list = this.getFacilitiesHavingPrivileges(
            ec_node_list,
            isas_node_list
          );
          if (_.get(params, "id", null) != null) {
            if (_.has(resp_arr, "3.item.0")) {
              this.device = new DeviceModelCriteria(resp_arr[3].item[0]);
              /* check if inventory status has is_factory as true */
            }
            if (_.has(resp_arr, "4.item.0")) {
              this.device.device_people = new DevicePeopleModelCriteria(
                resp_arr[4].item[0]
              );
            }
          } else {
            this.device.facility = this.auth_storage.people.attributes.facility_node;
          }
        },
        (error) => {
          var message = "Error getting data";
          if (_.has(error, "error.message")) {
            message = error.error.message;
          }
          this.toatr_service.error(message);
        }
      )
      .add(() => {
        this.is_loading = false;
      });

    // this.route.queryParams.subscribe((params) => {
    //   console.log("params", params);
    //   if (_.get(params, "id", null) != null) {
    //     this.is_edit = true;
    //     var request = new ActionReq<DeviceModel>({
    //       item: new DeviceModel({ id: parseInt(params["id"]) }),
    //     });
    //     this.is_loading = true;
    //     this.service
    //       .getDevice(request)
    //       .subscribe((resp: ActionRes<Array<DeviceModel>>) => {
    //         if (resp.item.length > 0) {
    //           this.device = resp.item[0];
    //         }
    //       })
    //       .add(() => {
    //         this.is_loading = false;
    //       });
    //   }
    // });
  }
  onChangeDeviceType(type) {
    if (this.is_edit == false && this.is_loading == false) {
      if (type == DeviceModel.DeviceTypes.dexcom) {
        InventoryStatusModel;
        var default_inventory_status = _.find(this.inventory_status_list, {
          inventory_status_key:
            InventoryStatusModel.FactoryStatuses.unconnected_disposable,
        });
        if (default_inventory_status)
          this.device.inventory_status_id = default_inventory_status.id;
      } else {
        InventoryStatusModel;
        var default_inventory_status = _.find(this.inventory_status_list, {
          inventory_status_key: InventoryStatusModel.FactoryStatuses.active,
        });
        if (default_inventory_status)
          this.device.inventory_status_id = default_inventory_status.id;
      }
    }
    // if (type == DeviceModel.DeviceTypes.dexcom) {
    //   this.device.attributes = [
    //     { label: "Transmitter Status Code", value: "", key: "tx_status" },
    //     { label: "Error Code", value: "", key: "error_code" },
    //     { label: "CGM Firmware Version", value: "", key: "cgm_firmware" },
    //     { label: "BLE Firmware Version", value: "", key: "ble_firmware_ver" },
    //     { label: "Hardware Version", value: "", key: "hw_version" },
    //     { label: "BLE Soft Device Version", value: "", key: "ble_sw_version" },
    //     {
    //       label: "Hardware ID of the Nordic BLE chip",
    //       value: "",
    //       key: "hw_id",
    //     },
    //     { label: "Transmitter Run Time", value: "", key: "tx_run_time" },
    //     { label: "Algorithm State", value: "", key: "algorithm_state" },
    //     { label: "Transmitter Version", value: "", key: "tx_version" },
    //     { label: "Software Number", value: "", key: "sw_number" },
    //     { label: "API Version", value: "", key: "api_version" },
    //     { label: "RSSI", value: "", key: "RSSI" },
    //     { label: "DexcomXX", value: "", key: "broadcastID" },
    //   ];
    // } else {
    //   this.device.attributes = [];
    // }
  }
  // addAttribute() {
  //   if (
  //     _.get(this.device, "attributes", null) != null &&
  //     _.isArray(this.device.attributes)
  //   ) {
  //     this.device.attributes.push({
  //       label: "",
  //       value: "",
  //     });
  //   } else {
  //     this.device.attributes = [];
  //     this.device.attributes.push({
  //       label: "",
  //       value: "",
  //     });
  //   }
  // }
  // deleteAttrubute(index) {
  //   (this.device.attributes as Array<any>).splice(index, 1);
  // }
  save(form: NgForm) {
    if (form.valid) {
      if (this.device.device_type == DeviceModel.DeviceTypes.dexcom) {
        this.device.is_disposable = true;
        // if (this.device.attributes) {
        //   this.device.attributes = _.forEach(
        //     this.device.device_type,
        //     (v: any) => {
        //       v.key = v.label.toUpperCase().replace(" ", "_");
        //     }
        //   );
        // }
      }
      var request = new ActionReq<DeviceModel>({
        item: this.device,
      });
      this.is_loading = true;
      this.service
        .saveDevice(request)
        .subscribe(
          (resp) => {
            if (resp) {
              if (this.is_edit == false)
                this.device = new DeviceModelCriteria();
              this.toatr_service.success("Device saved successfully");
            }
          },
          (error) => {
            this.toatr_service.error("Error saving Device");
          }
        )
        .add(() => {
          this.is_loading = false;
        });
    }
  }
  close() {
    this.location.back();
  }

  showDeviceInventoryStatusHistoryPopup = () => {
    const alert = this.dialog.open(DeviceInventoryStatusHistoryDialog, {
      height: "90vh",
      width: "90vw",
      data: this.device,
    });
    alert.afterClosed().subscribe(() => {});
  };
  onInventoryStatusChange(status: InventoryStatusModel) {
    if (status.is_factory == true) {
      this.toatr_service.warning(
        `Inventory status '${status.inventory_status_text}' can't be set manually`
      );
      setTimeout(() => {
        this.device.inventory_status_id = 0;
      }, 200);
    } else {
      this.device.inventory_status_id = status.id;
    }
  }
  showDeviceLastSeenHistoryPopup = () => {
    const alert = this.dialog.open(DeviceLastSeenHistoryDialog, {
      height: "90vh",
      width: "90vw",
      data: {
        device_id: this.device.id,
        device_name: this.device.device_name,
        device_type: this.device.device_type,
        serial_no: this.device.serial_no,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
  showSoftwareVersionHistoryPopup = () => {
    const alert = this.dialog.open(SoftwareVersionHistoryDialog, {
      height: "90vh",
      width: "90vw",
      data: new DeviceSoftwareVersionCriteria({
        device_id: this.device.id,
        device: this.device,
      }),
    });
    alert.afterClosed().subscribe(() => {});
  };
  showDeviceBatteryStatusHistoryPopup = () => {
    // if (this.device.device_type == "IDH") {
    const alert = this.dialog.open(DeviceBatteryStatusHistoryDialog, {
      height: "90vh",
      width: "90vw",
      // data: args.dataContext,
      data: {
        device_id: this.device.id,
        device_name: this.device.device_name,
        device_type: this.device.device_type,
        serial_no: this.device.serial_no,
      },
    });
    alert.afterClosed().subscribe(() => {});
    // }
  };
  showDeviceNetworkHistoryPopup = () => {
    const alert = this.dialog.open(DeviceNetworkHistoryDialog, {
      height: "90vh",
      width: "90vw",
      // data: args.dataContext,
      data: {
        device_id: this.device.id,
        device_name: this.device.device_name,
        device_type: this.device.device_type,
        serial_no: this.device.serial_no,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
  showDeviceAssociationHistoryPopup = () => {
    const alert = this.dialog.open(DeviceAssociationLogsGatewayDialog, {
      height: "90vh",
      width: "90vw",
      // data: args.dataContext,
      data: {
        device_id: this.device.id,
        device_name: this.device.device_name,
        device_type: this.device.device_type,
        serial_no: this.device.serial_no,
      },
    });
    alert.afterClosed().subscribe(() => {});
  };
  showSelectFacilityPopup = () => {
    const alert = this.dialog.open(SelectFacilityGatewayDialog, {
      maxHeight: "90vh",
      maxWidth: "90vw",
      minWidth: "30vw",
      data: this.device.facility,
    });
    alert.afterClosed().subscribe((result: boolean | ISASHierarchyNode) => {
      if (result) {
        this.device.facility = result as ISASHierarchyNode;
      }
    });
  };
  showAssociatePopup = () => {
    const alert = this.dialog.open(AssociatePeopleGatewayDialog, {
      maxHeight: "90vh",
      maxWidth: "90vw",
      minWidth: "30vw",
      data: new DevicePeopleModelCriteria({
        device_serial_no: this.device.serial_no,
        device_type: this.device.device_type,
      }),
    });
    alert.afterClosed().subscribe((result) => {
      {
        if (result) this.getData();
      }
    });
  };
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
  selectFacility(node: NodeWithHierarchy) {
    this.device.facility = node.isas_node;
  }
  onFacilitySearch(term: string, item: NodeWithHierarchy) {
    term = term.toLowerCase();
    return item.node_name.toLowerCase().indexOf(term) > -1;
  }
}
