import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormServiceService} from "../form-service.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(private sendService: FormServiceService,
              private cookieService: CookieService) { }

  ngOnInit(): void {
  }
  @Output() pointDeleted = new EventEmitter();
  @Input() isModer: boolean;
  @Input() points: any[];


  deletePoint(id) {
    this.sendService.sendHttp("/deletePoint", new Map<string, any>()
      .set(
        "moderator", this.cookieService.get("moderUser") == "" ?
          this.cookieService.get("currentUser") :
          this.cookieService.get("moderUser"))
      .set("point_id", id));
    this.pointDeleted.emit();
  }
}
