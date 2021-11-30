import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormServiceService} from "../form-service.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.css']
})
export class ModeratorComponent implements OnInit {
  selectedUser: string;
  outputUsers: string[];
  resultUsers: string[] = [];

  @Output() userChange = new EventEmitter();


  constructor(private sendService: FormServiceService,
              private cookieService: CookieService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.sendService.getUsers().then((users => {
      for (let i in users)
        this.resultUsers.push(users[i].username);
    }))
    this.selectedUser = JSON.parse(this.cookieService.get("currentUser")).username;

  }


  searchUser(event) {
    this.outputUsers = this.resultUsers.filter(c => c.toString().startsWith(event.query));
  }

  changeUser() {
    if (this.cookieService.get("moderUser") == "") {
      this.cookieService.set("moderUser", this.cookieService.get("currentUser"))
    }
    this.sendService.changeUser(this.selectedUser).then((user) => {
      if (user && user.jwt) {
        this.cookieService.set("currentUser", JSON.stringify(user))
        this.userChange.emit();
      } else {
        this.manageErrCode(user.errCode);
      }
    })
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
}
