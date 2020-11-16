import { Component, HostListener } from "@angular/core";

@Component({
  selector: "gateway-root",
  templateUrl: "./gateway.component.html",
  styleUrls: ["./gateway.component.scss"],
})
export class GatewayComponent {
  opened: boolean = true;
  events: string[] = [];
  is_mobile: boolean = false;
  constructor() {}

  ngOnInit() {
    this.identifyDevice();
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.identifyDevice();
  }
  identifyDevice() {
    var width = window.innerWidth;
    if (width > 992) {
      this.is_mobile = false;
      this.opened = true;
    } else {
      this.is_mobile = true;
      this.opened = false;
    }
  }
}
