import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {JwtService} from "./jwt-service/jwt.service";
import {sha256} from "js-sha256";
import {FormServiceService} from "../form/services/send-service/form-service.service";

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.css']
})
export class LoggingComponent implements OnInit, OnDestroy {
  username: string;
  password: string;
  message;
  clockIntervalId: NodeJS.Timeout;


  constructor(private router: Router,
              private cookieService: CookieService,
              private jwtService: JwtService,
              private sendService: FormServiceService) {
  }

  ngOnInit(): void {
    if (this.cookieService.check("message")) {
      this.message = this.cookieService.get("message");
      this.cookieService.delete("message");
    }
    this.digitalClock();
    this.clockIntervalId = setInterval(this.digitalClock, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.clockIntervalId);
  }


  login() {
    if (this.validateForm()) {

      this.sendService.sendHttp("/login", new Map<string, any>()
        .set("username", this.username)
        .set("password", sha256(this.password)))

        .then((user) => {
        if (user && user.jwt) {
          this.cookieService.set("currentUser", JSON.stringify(user))
          this.jwtService.currentUserSubject = user;
          this.router.navigate(['/']);
        } else {
          switch (user.errCode) {
            case 2: {
              this.message = "Пользователя с таким именем и паролем не найдено"
              break
            }
            case 4: {
              this.message = "хелиос упал брат"
              break
            }
          }
        }

      })


    }

  }

  register() {
    if (this.validateForm()) {

      this.sendService.sendHttp("/register", new Map<string, any>()
        .set("username", this.username)
        .set("password", sha256(this.password)))

        .then((user) => {
        if (user && user.jwt) {
          this.cookieService.set("currentUser", JSON.stringify(user))
          this.jwtService.currentUserSubject = user;
          this.router.navigate(['/']);
        } else {
          switch (user.errCode) {
            case 1: {
              this.message = "Пользователь с таким именем уже существует"
              break
            }
            case 4: {
              this.message = "хелиос упал брат"
              break
            }
          }
        }

      })


    }


  }

  makeRed(field_id) {
    document.getElementById(field_id)!.style.border = "1px solid";
    document.getElementById(field_id)!.style.borderColor = "#c42929";
    return false;
  }

  makeWhite(field_id) {
    document.getElementById(field_id)!.style.border = "0";
    document.getElementById(field_id)!.style.borderColor = "#8C9EAE";
  }

  validateForm(): boolean {
    let validUname = true;

    if (this.username == undefined)
      validUname = this.makeRed("uname");
    else {
      if (!/^[a-zA-Z1-9]+$/.test(this.username)) {
        this.message = "В логине должны быть только латинские буквы и цифры";
        validUname = this.makeRed("uname");
      }
      if (this.username.length < 3) {
        this.message = "Слишком короткий логин"
        validUname = this.makeRed("uname");
      }
      if (this.username.length > 15) {
        this.message = "Слишком длинный логин"
        validUname = this.makeRed("uname");
      }
    }

    if (validUname) {
      this.makeWhite("uname");
      this.message = ""
    }


    let validPsw = true;

    if (this.password == undefined)
      validPsw = this.makeRed("psw");
    else {
      if (!/^[a-zA-Z1-9]+$/.test(this.password)) {
        this.message = "В пароле должны быть только латинские буквы и цифры";
        validPsw = this.makeRed("psw");
      }
      if (this.password.length < 3) {
        this.message = "Слишком короткий пароль"
        validPsw = this.makeRed("psw");
      }
      if (this.password.length > 20) {
        this.message = "Слишком длинный пароль"
        validPsw = this.makeRed("psw");
      }
    }

    if (validPsw) {
      this.makeWhite("psw");
      if (!validUname) this.message = ""
    }

    return validUname && validPsw;
  }

  digitalClock() {
    const date = new Date();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();
    //* добавление ведущих нулей */
    if (parseInt(hours) < 10) hours = "0" + hours;
    if (parseInt(minutes) < 10) minutes = "0" + minutes;
    if (parseInt(seconds) < 10) seconds = "0" + seconds;
    document.getElementById("clock")!.innerHTML = hours + ":" + minutes + ":" + seconds;
  }

}
