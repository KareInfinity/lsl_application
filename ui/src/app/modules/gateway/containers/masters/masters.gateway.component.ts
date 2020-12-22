import { Component, OnInit } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";
@Component({
  selector: "gateway-masters",
  templateUrl: "./masters.gateway.component.html",
  styleUrls: ["./masters.gateway.component.css"],
})
export class MastersGatewayComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  selected_tab_index: number = 0;
  ngOnInit() {
    this.selected_tab_index = _.get(
      this.route,
      "snapshot.queryParams.selected_tab_index",
      0
    );
  }
  selectedTabChange(e: MatTabChangeEvent) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { selected_tab_index: e.index },
      queryParamsHandling: "merge",
    });
  }
}
