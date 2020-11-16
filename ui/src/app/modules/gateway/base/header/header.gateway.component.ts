import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as JWT from 'jwt-decode';

@Component({
  selector: "gateway-header",
  templateUrl: "./header.gateway.component.html",
  styleUrls: ["./header.gateway.component.css"],
})
export class HeaderGatewayComponent implements OnInit {
  name = "";
  constructor(private router: Router) {}

  ngOnInit() {
    let token = localStorage.getItem("token");
    if (token !== null) {
      let decoded: any = JWT(token);
      this.name = decoded.data.name;
    }
  }

  logout(event) {
    localStorage.removeItem("token");
    this.router.navigate(["/auth/login"]);
  }
}
