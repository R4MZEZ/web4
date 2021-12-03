import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormServiceService} from "../form-service.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {combineAll} from "rxjs";

@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.component.html',
  styleUrls: ['./moderator.component.css',]
})
export class ModeratorComponent implements OnInit {
  selectedUser: string;
  outputUsers: string[];
  resultUsers: string[] = [];

  selectedRole: string;
  outputRoles: string[];
  resultRoles: string[] = ["Пользователь", "Модератор", "Администратор"];

  @Output() userChange = new EventEmitter();
  @Input() isAdmin: boolean;
  message: string;
  selectedUser_role: string;


  constructor(private sendService: FormServiceService,
              private cookieService: CookieService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.updateUserList();
    this.selectedUser = JSON.parse(this.cookieService.get("currentUser")).username;

    this.setRole();
    setTimeout(() => {
      this.checkIfSameRole();
    }, 10);

  }

  setRole() {
    this.sendService.sendHttp("/checkRole", new Map<string, any>()
      .set("token", this.cookieService.get("currentUser")))

      .then((answer) => {
        switch (answer.role) {
          case "1": {
            this.selectedRole = "Пользователь"
            this.selectedUser_role = "Пользователь";
            break;
          }
          case "2": {
            this.selectedRole = "Модератор"
            this.selectedUser_role = "Модератор"
            break;
          }
          case "3": {
            this.selectedRole = "Администратор"
            this.selectedUser_role = "Администратор"
            break;
          }

        }
      })
  }

  searchUser(event) {
    this.outputUsers = this.resultUsers.filter(c => c.toString().startsWith(event.query));
  }

  searchRole(event) {
    this.outputRoles = this.resultRoles.filter(c => c.toString().startsWith(event.query));
  }

  changeUser() {
    if (this.cookieService.get("moderUser") == "") {
      this.cookieService.set("moderUser", this.cookieService.get("currentUser"))
    }


    this.sendService.sendHttp("/fakeLogin", new Map<string, any>()
      .set("moderator", this.cookieService.get("moderUser"))
      .set("username", this.selectedUser)).then((user) => {
      if (user && user.jwt) {
        this.cookieService.set("currentUser", JSON.stringify(user))
        this.userChange.emit();
        this.setRole();
        this.checkIfSameRole();
      } else {
        console.log("change user error code: " + user.errCode)
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

  changeRole() {
    this.sendService.sendHttp("/changeRole", new Map<string, any>()
      .set(
        "moderator", this.cookieService.get("moderUser") == "" ?
          this.cookieService.get("currentUser") :
          this.cookieService.get("moderUser"))
      .set("user_id", JSON.parse(this.cookieService.get("currentUser")).id)
      .set("role", this.selectedRole))

      .then((answer) => {
        if (answer.errCode) {
          console.log("change role error code: " + answer.errCode)
          this.manageErrCode(answer.errCode)
        }
        else {
          document.getElementById("successMessage")!.style.opacity = '1';
          document.getElementById("change-button")!.setAttribute("disabled", "true")
          this.setRole();
          setTimeout(() => {
            document.getElementById("successMessage")!.style.opacity = '0';
          }, 2000);
        }
      });

  }

  checkIfSameRole() {
    console.log(this.selectedRole)
    console.log(this.selectedUser_role)

    if (this.selectedRole === this.selectedUser_role) {
      document.getElementById("change-button")!.setAttribute("disabled", "true")
    } else {
      document.getElementById("change-button")!.removeAttribute("disabled")
      console.log("we are here")
    }
  }

  deleteUser() {
    this.sendService.sendHttp("/deleteUser", new Map<string, any>()
      .set(
        "moderator", this.cookieService.get("moderUser") == "" ?
          this.cookieService.get("currentUser") :
          this.cookieService.get("moderUser"))
      .set("user_id", JSON.parse(this.cookieService.get("currentUser")).id))

      .then((answer) => {
        if (answer.errCode) {
          console.log("delete user error code: " + answer.errCode)
          this.manageErrCode(answer.errCode)
        }
        else {
          if (this.cookieService.get("moderUser") == "" ||
            this.cookieService.get("moderUser") === this.cookieService.get("currentUser")) {
            this.cookieService.delete("currentUser");
            this.cookieService.delete("moderUser");
            this.router.navigate(['/login'])
          } else {
            document.getElementById("successMessage")!.style.opacity = '1';
            this.selectedUser = JSON.parse(this.cookieService.get("moderUser")).username;
            this.changeUser();
            this.updateUserList();
            setTimeout(() => {
              document.getElementById("successMessage")!.style.opacity = '0';
            }, 2000);
          }
        }
      });
  }

  updateUserList() {
    this.resultUsers = [];
    this.sendService.sendHttp("/getUsers", new Map<string, any>())
      .then((users => {
        for (let i in users)
          this.resultUsers.push(users[i].username);
      }))

  }
}
