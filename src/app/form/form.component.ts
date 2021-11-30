import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormServiceService} from "./form-service.service";
import {ValidationService} from "./validator/validation.service";
import {FormGraphConnectorService} from "./form-graph-connector/form-graph-connector.service";
import {Subscription} from 'rxjs';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";


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
              private cookieService: CookieService) {
  }

  isModer: boolean = false;
  isAdmin: boolean = false;

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
    this.checkRole();

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  checkRole() {
    // @ts-ignore
    let answer: Promise<any> = this.sendService.getRole();

    answer.then((answer) => {
      if (answer && answer.role) {
        switch (answer.role) {
          case "1": {
            this.isModer = false;
            break;
          }
          case "2": {
            this.isModer = true;
            break;
          }
          case "3": {
            this.isAdmin = true;
            break;
          }

        }
      } else {
        this.manageErrCode(answer.errCode);
      }

    })

  }

  updateTable() {
    this.points = [];
    this.sendService.getPoints().then((points) => {
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

    let answer;
    answer = this.sendService.sendCoordinates(this.selectedX, this.selectedY, this.selectedR);

    answer.then((result) => {
      this.manageErrCode(result.errCode);
      this.addPoint(result);
      this.formGraphService.updatePoint(result);
    })

  }

  addPoint(point) {
    this.points.push(point);
  }

  clearTable() {
    this.sendService.clear().then((result) => {
      this.manageErrCode(result.errCode);
    });
    this.points = []
  }

  manageErrCode(errCode) {
    switch (errCode) {
      case 3: {
        this.cookieService.delete("currentUser");
        this.cookieService.set("message", "Время сессии истекло, пожалуйста, выполните повторную авторизацию")
        this.router.navigate(['/login']);
        break;
      }
      case 4: {
        this.cookieService.delete("currentUser");
        this.cookieService.set("message", "хелиос упал брат")
        this.router.navigate(['/login']);
        break;
      }
    }
  }

  logout() {
    this.cookieService.delete("currentUser");
    this.cookieService.delete("moderUser");

    this.router.navigate(['/login']);
  }

  public changeR() {
    this.formGraphService.changeSelectedR(this.selectedR)
  }

  updateGraph() {
    this.formGraphService.changePoints([]);
  }
}
