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
  // @HostListener("window:scroll") onScroll(e: Event): void {
  //   console.log(this.getYPosition(e));
  // }
  // @HostListener("scroll") onScrollHost(e: Event): void {
  //   console.log(this.getYPosition(e));
  // }
  // getYPosition(e: Event): number {
  //   return (e.target as Element).scrollTop;
  // }
  @HostListener("scroll", ["$event"])
  scrollHandler(event) {
    console.debug("Scroll Event");
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
