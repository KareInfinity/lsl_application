import { Component, OnInit } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import {
  GridOption,
  Column,
  GridService,
  AngularGridInstance,
  Filters,
  FieldType,
  Formatters,
  OnEventArgs,
  BsDropDownService,
} from "angular-slickgrid";
import {
  MatDialog,
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from "@angular/material";
import { AssociateCableGatewayDialog } from "../../dialogs/associatecable/associatecable.gateway.dialog";
import { FlatTreeControl } from "@angular/cdk/tree";
import { SelectionModel } from "@angular/cdk/collections";
import { ConfigurationGatewayService } from "./configuration.gateway.sevice";
import { ActionRes } from "src/app/modules/global/models/actionres.model";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { CableModel } from "../../models/cable.model";
import { DriverModel } from "../../models/driver.model";
import { CableDriverMapModel } from "../../models/cabledrivermap.model";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "gateway-configuration",
  templateUrl: "./configuration.gateway.component.html",
  styleUrls: ["./configuration.gateway.component.scss"],
})
export class ConfigurationGatewayComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: ConfigurationGatewayService,
    private toastr_service: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getData();
    this.setupCableListGrid();
  }
  /* variables */
  selected_device = null;
  driver_list: any;
  enabled_device_list = [
    // {
    //   id: 1,
    //   feature_name: "DexCom",
    // },
  ];

  /* mat tree vars */
  site_tree: Array<ItemNode> = [];
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ItemFlatNode, ItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ItemNode, ItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: ItemFlatNode | null = null;

  /** The new item's name */
  newItemName = "";

  treeControl: FlatTreeControl<ItemFlatNode>;

  treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;

  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<ItemFlatNode>(true /* multiple */);

  /* slick grid */
  cable_driver_map_list_angular_grid: AngularGridInstance;
  cable_driver_map_list_grid: any;
  cable_driver_map_list_grid_service: GridService;
  cable_driver_map_list_grid_data_view: any;
  cable_driver_map_list_grid_column_definitions: Column[];
  cable_driver_map_list_grid_options: GridOption;
  cable_driver_map_list_grid_dataset: Array<any> = [];
  cable_driver_map_list_grid_updated_object: any;

  getData() {
    this.service.getDeviceList().subscribe(
      (res: ActionRes<any>) => {
        if (_.has(res, "item.0")) {
          this.enabled_device_list = res.item;
        }
      },
      (err) => {
        this.toastr_service.error("Error getting devices");
      }
    );
    this.service.getCableDriverMapList().subscribe(
      (resp: ActionRes<Array<CableDriverMapModel>>) => {
        if (_.has(resp, "item.0")) {
          this.cable_driver_map_list_grid_dataset = resp.item;
        }
      },
      (error) => {
        this.toastr_service.error("Error getting Cable Driver Association");
      }
    );

    /* site tree */
    this.getSiteTreeData();
  }
  getSiteTreeData() {
    this.setupTree();

    this.service.getSiteTree().subscribe((resp: ActionRes<any>) => {
      var sites = resp.item;
      var site_as_itemnodearray = _.map(sites, (v) => {
        var node = new ItemNode();
        node.item = v.Site;
        node.children = [];
        return node;
      });
      this.site_tree = this.buildTreeData(site_as_itemnodearray);
      this.setupTree();
    });
    // var sites = [
    //   {
    //     Site: {
    //       Uid: "eb83de10-bd07-11ea-861a-11bbb43c084b",
    //       Id: 1,
    //       Name: "customer 10",
    //       ParentId: null,
    //       MappedPrivileges: [],
    //     },
    //   },
    //   {
    //     Site: {
    //       Uid: "ba10d180-0ea1-11eb-bec1-4706e5ac871b",
    //       Id: 4,
    //       Name: "Region1",
    //       ParentId: 1,
    //       MappedPrivileges: [],
    //     },
    //   },
    //   {
    //     Site: {
    //       Uid: "c09a18e0-0ea1-11eb-bec1-4706e5ac871b",
    //       Id: 5,
    //       Name: "Region2",
    //       ParentId: 1,
    //       MappedPrivileges: [],
    //     },
    //   },
    //   {
    //     Site: {
    //       Uid: "6cc5d610-1486-11eb-b31d-2f9691878b11",
    //       Id: 6,
    //       Name: "Region3",
    //       ParentId: 1,
    //       MappedPrivileges: [
    //         {
    //           Privilege: {
    //             Key: "Key 1",
    //             Name: "May Test App",
    //           },
    //         },
    //         {
    //           Privilege: {
    //             Key: "Key 2",
    //             Name: "May View App",
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     Site: {
    //       Uid: "6ff766f0-1486-11eb-b31d-2f9691878b11",
    //       Id: 7,
    //       Name: "Campus 4",
    //       ParentId: 6,
    //       MappedPrivileges: [
    //         {
    //           Privilege: {
    //             Key: "Key 1",
    //             Name: "May Test App",
    //           },
    //         },
    //         {
    //           Privilege: {
    //             Key: "Key 2",
    //             Name: "May View App",
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     Site: {
    //       Uid: "6aee4bf0-14ff-11eb-b45e-41b0516b33d9",
    //       Id: 8,
    //       Name: "Campus 1",
    //       ParentId: 4,
    //       MappedPrivileges: [],
    //     },
    //   },
    //   {
    //     Site: {
    //       Uid: "702d6010-14ff-11eb-b45e-41b0516b33d9",
    //       Id: 9,
    //       Name: "Campus 2",
    //       ParentId: 4,
    //       MappedPrivileges: [
    //         {
    //           Privilege: {
    //             Key: "Key 1",
    //             Name: "May Test App",
    //           },
    //         },
    //         {
    //           Privilege: {
    //             Key: "Key 2",
    //             Name: "May View App",
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     Site: {
    //       Uid: "75835790-14ff-11eb-b45e-41b0516b33d9",
    //       Id: 10,
    //       Name: "Campus 3",
    //       ParentId: 5,
    //       MappedPrivileges: [],
    //     },
    //   },
    // ];
  }
  openAssociateCableDialog(): void {
    const dialogRef = this.dialog.open(AssociateCableGatewayDialog, {
      width: "20vw",
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getData();
      }
    });
  }

  selectDevice(device) {
    if (this.selected_device == device) {
      this.selected_device = null;
    } else {
      this.selected_device = device;
    }
  }

  /* slick grid */
  cableDriverMapList(angularGrid: AngularGridInstance) {
    this.cable_driver_map_list_angular_grid = angularGrid;
    this.cable_driver_map_list_grid_data_view = angularGrid.dataView;
    this.cable_driver_map_list_grid = angularGrid.slickGrid;
    this.cable_driver_map_list_grid_service = angularGrid.gridService;
  }
  setupCableListGrid() {
    this.cable_driver_map_list_grid_column_definitions = [
      // {
      //   name: "#",
      //   field: "id",
      //   id: "id",
      //   formatter: function (row) {
      //     return (row + 1).toString();
      //   },
      //   minWidth: 50,
      //   maxWidth: 50,
      // },
      {
        id: "unique_identifier",
        name: "Unique Identifier",
        field: "cable_name",
        type: FieldType.string,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "security_key",
        name: "Security Key",
        field: "security_key",
        type: FieldType.string,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "registered_date",
        name: "Registered Date",
        field: "created_on",
        type: FieldType.string,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "last_used_date",
        name: "Last Used Date",
        field: "modified_on",
        type: FieldType.string,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
    ];
    this.cable_driver_map_list_grid_options = {
      asyncEditorLoading: false,
      // autoHeight:true,
      autoResize: {
        containerId: "cable-driver-map-list-grid-container",
        sidePadding: 15,
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableFiltering: true,
      //   checkboxSelector: {
      //     // you can toggle these 2 properties to show the "select all" checkbox in different location
      //     hideInFilterHeaderRow: false,
      //     hideInColumnTitleRow: true,
      //   },
      //   rowSelectionOptions: {
      //     // True (Single Selection), False (Multiple Selections)
      //     selectActiveRow: false,
      //   },
      //   enableCheckboxSelector: true,
      //   enableRowSelection: true,
    };
  }

  // tree things
  setupTree() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<ItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
    // this.dataSource.data = this.buildFileTree(this.site_tree, 0);
    this.dataSource.data = this.site_tree;
  }
  buildFileTree(obj: { [key: string]: any }, level: number): ItemNode[] {
    return Object.keys(obj).reduce<ItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new ItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === "object") {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  getLevel = (node: ItemFlatNode) => node.level;

  isExpandable = (node: ItemFlatNode) => node.expandable;

  getChildren = (node: ItemNode): ItemNode[] => node.children;

  hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: ItemFlatNode) => _nodeData.item === "";

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: ItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new ItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: ItemFlatNode): void {
    let parent: ItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: ItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every((child) =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: ItemFlatNode): ItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
  getChildrenData = (node: ItemNode, data: Array<ItemNode>) => {
    node.children = _.filter(data, (v) => {
      return v.item.ParentId == node.item.Id;
    });
    if (node.children.length > 0) {
      node.children = _.forEach(node.children, (v) => {
        v = this.getChildrenData(v, data);
      });
    } else {
      node.children = null;
    }
    return node;
  };
  buildTreeData = (data: Array<ItemNode>) => {
    var tree: Array<ItemNode> = [];
    _.forEach(data, (v) => {
      if (v.item.ParentId == null) {
        v = this.getChildrenData(v, data);
        tree.push(v);
      }
    });
    return tree;
  };
  // tree things end
  gotoImportCables() {
    this.router.navigate(["import-cables"], {
      relativeTo: this.route,
    });
  }
}

/* classes */
/**
 * Node for to-do item
 */
class ItemNode {
  children: ItemNode[] = [];
  item: any = {};
}
/** Flat to-do item node with expandable and level information */
export class ItemFlatNode {
  item: any;
  level: number;
  expandable: boolean;
}
