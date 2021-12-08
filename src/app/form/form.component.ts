import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormServiceService} from "./services/send-service/form-service.service";
import {ValidationService} from "./services/validator/validation.service";
import {FormGraphConnectorService} from "./services/form-graph-connector/form-graph-connector.service";
import {Subscription} from 'rxjs';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {PushService} from "./services/push-service/push.service";
import {ErrorManagerService} from "./services/error-manager-service/error-manager.service";
import {isDefaultLibrary} from "@angular/compiler-cli/ngcc/src/packages/source_file_cache";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {

  constructor(private sendService: FormServiceService,
              private validateService: ValidationService,
              private formGraphService: FormGraphConnectorService,
              private router: Router,
              private cookieService: CookieService,
              private pushService: PushService,
              private errorManagerService: ErrorManagerService) {
  }

  isModer: boolean = false;
  isAdmin: boolean = false;
  moderPanelShowed: boolean = true;

  private subs: Subscription;
  subX: number;
  subY: number;

  points: any[] = [];

  outputX: number[];
  selectedX: number;
  resultsX: number[] = [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5];

  selectedY: number = 0;

  outputR: number[];
  selectedR: number;
  resultsR: number[] = [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5];

  mediaQueryDesktop = window.matchMedia('(min-width: 1046px)')
  mediaQueryTablet = window.matchMedia('(max-width: 1046px) and (min-width: 738px)')
  mediaQueryMobile = window.matchMedia('(max-width: 738px)')


  searchX(event) {
    this.outputX = this.resultsX.filter(c => c.toString().startsWith(event.query));
  }

  searchR(event) {
    this.outputR = this.resultsR.filter(c => c.toString().startsWith(event.query));
  }

  ngOnInit(): void {
    this.subs = this.formGraphService.x$.subscribe((x) => this.subX = x);
    this.subs = this.formGraphService.y$.subscribe((y) => this.subY = y);
    this.subs = this.formGraphService.r$.subscribe(() => {
      let savedX = this.selectedX;
      let savedY = this.selectedY;
      this.selectedX = this.subX;
      this.selectedY = this.subY;
      this.send();
      this.selectedX = savedX;
      this.selectedY = savedY;
      document.getElementById("invisible-button")!.click();
    });
    this.updateTable();
    this.checkRole().then((answer) => {
      if (answer && answer.role) {
        switch (answer.role) {
          case "1": {
            this.isModer = false;
            this.isAdmin = false;
            break;
          }
          case "2": {
            this.isModer = true;
            this.isAdmin = false;
            break;
          }
          case "3": {
            this.isModer = true;
            this.isAdmin = true;
            break;
          }

        }

        setTimeout(()=>{this.desktopScale(this.mediaQueryDesktop)
          this.tabletScale(this.mediaQueryTablet)
          this.mobileScale(this.mediaQueryMobile)}, 1)


      } else {
        this.errorManagerService.manageErrCode(answer.errCode);
      }

    });

    setTimeout(() => this.pushService.sendWebSocket(
      this.cookieService.get("moderUser") == "" ?
        JSON.parse(this.cookieService.get("currentUser")).id :
        JSON.parse(this.cookieService.get("moderUser")).id), 1000)
    Notification.requestPermission();

    this.pushService.roleChanged$.subscribe((newRole) => {
      switch (newRole) {
        case 1:
          this.isAdmin = false;
          this.isModer = false;
          break;
        case 2:
          this.isAdmin = false;
          this.isModer = true;
          break;
        case 3:
          this.isAdmin = true;
          this.isModer = true;
      }
    })

    this.mediaQueryDesktop.addListener(this.desktopScale)
    this.mediaQueryTablet.addListener(this.tabletScale)
    this.mediaQueryMobile.addListener(this.mobileScale)


  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.pushService.disconnect();
  }

  checkRole(): Promise<any> {
    return this.sendService.sendHttp("/checkRole", new Map<string, any>()
      .set("token", this.cookieService.get("moderUser") == "" ?
        this.cookieService.get("currentUser") :
        this.cookieService.get("moderUser")))


  }

  updateTable() {
    this.points = [];

    this.sendService.sendHttp("/points", new Map<string, any>()
      .set("token", this.cookieService.get("currentUser")))

      .then((points) => {
        console.log(points)
        for (let i in points) {
          this.points.push(points[i]);
          this.formGraphService.updatePoint(points[i]);
        }
      });


  }

  send() {
    let valid = true;

    if (!this.validateService.validateX(this.selectedX)) valid = false;
    if (!this.validateService.validateY(this.selectedY)) valid = false;
    if (!this.validateService.validateR(this.selectedR)) valid = false;

    if (!valid) return;


    this.sendService.sendHttp("/checkPoint", new Map<string, any>()
      .set("token", this.cookieService.get("currentUser"))
      .set("x", this.selectedX)
      .set("y", this.selectedY)
      .set("r", this.selectedR))

      .then((result) => {
        this.errorManagerService.manageErrCode(result.errCode);
        this.addPoint(result);
        this.formGraphService.updatePoint(result);
      })

  }

  addPoint(point) {
    this.points.push(point);
  }

  clearTable() {
    this.sendService.sendHttp("/clear", new Map<string, any>()
      .set("token", this.cookieService.get("currentUser")))

      .then((result) => {
        this.errorManagerService.manageErrCode(result.errCode);
      });
    this.points = []
  }

  logout() {
    this.cookieService.delete("currentUser");
    this.cookieService.delete("moderUser");
    this.router.navigate(['/login'])
    this.pushService.disconnect();
  }

  public changeR() {
    this.formGraphService.changeSelectedR(this.selectedR)
  }

  updateGraph() {
    this.formGraphService.changePoints([]);
  }


  changeView() {
    if (this.moderPanelShowed) {
      document.getElementById("moderpanel")!.style.display = "none";
      document.getElementById("rightbar")!.style.display = "inline-block";
    } else {
      document.getElementById("moderpanel")!.style.display = "inline";
      document.getElementById("rightbar")!.style.display = "none";
    }
    this.moderPanelShowed = !this.moderPanelShowed;

  }


  desktopScale(e) {
    console.log(this.moderPanelShowed)
    if (e.matches) {
      document.getElementById("moderpanel")!.style.display = "inline";
      document.getElementById("rightbar")!.style.display = "inline-block";
      this.moderPanelShowed = true;

    }
  }

  tabletScale(e) {
    console.log(this.moderPanelShowed)
    if (e.matches) {
      document.getElementById("moderpanel")!.style.display = "none";
      document.getElementById("rightbar")!.style.display = "inline-block";
      this.moderPanelShowed = false;
    }
  }

  mobileScale(e) {

    if (e.matches) {
      if (this.moderPanelShowed) {
        document.getElementById("moderpanel")!.style.display = "inline";
        document.getElementById("rightbar")!.style.display = "none";
      } else {
        document.getElementById("moderpanel")!.style.display = "none";
        document.getElementById("rightbar")!.style.display = "inline-block";
      }
    }
  }


}
