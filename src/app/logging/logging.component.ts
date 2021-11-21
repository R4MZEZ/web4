import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {JwtService} from "./jwt-service/jwt.service";
import {sha256} from "js-sha256";

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.css']
})
export class LoggingComponent implements OnInit {
  username: string;
  password: string;
  loginURL = "http://127.0.0.1:8080/backend-1.0-SNAPSHOT/login"
  registerURL = "http://127.0.0.1:8080/backend-1.0-SNAPSHOT/register"
  message;


  constructor(private router: Router,
              private cookieService: CookieService,
              private jwtService: JwtService) { }

  ngOnInit(): void {
    if (this.cookieService.check("message")){
      this.message = this.cookieService.get("message");
      this.cookieService.delete("message");
    }
  }


  login() {
    if (this.validateForm()){
      fetch(this.loginURL,
        {
          method: 'POST',
          body: JSON.stringify({username: this.username, password: sha256(this.password)})
        }
      ).then(response => {
        if (!response.ok) {
          console.log("fail");
          return response.status;
        } else {
          console.log("success");
          return response.json();
        }

      }).then((user) =>{
        if (user && user.jwt){
          this.cookieService.set("currentUser",JSON.stringify(user))
          this.jwtService.currentUserSubject = user;
          this.router.navigate(['/']);
        }else {
          switch (user.errCode){
            case 2: {
              this.message = "Пользователя с таким именем и паролем не найдено"
              break
            }
            case 3:{
              //for new err codes
              break
            }
          }
        }

      })


    }

  }

  register() {
    if (this.validateForm()){
      fetch(this.registerURL,
        {
          method: 'POST',
          body: JSON.stringify({username: this.username, password: sha256(this.password)})
        }
      ).then(response => {
        if (!response.ok) {
          console.log("fail");
          return response.status;
        } else {
          console.log("success");
          return response.json();
        }

      }).then((user) =>{
        if (user && user.jwt){
          this.cookieService.set("currentUser",JSON.stringify(user))
          this.jwtService.currentUserSubject = user;
          this.router.navigate(['/']);
        }else {
          switch (user.errCode){
            case 1: {
              this.message = "Пользователь с таким именем уже существует"
              break
            }
            case 2:{
              //for new err codes
              break
            }
          }
        }

      })


    }


  }

  validateForm(): boolean{
    let valid = true;
    if (this.username != undefined && this.username.length > 0 && this.username.length <= 10){
      document.getElementById("uname")!.style.border = "0";
      document.getElementById("uname")!.style.borderColor = "#8C9EAE";
    } else {
      document.getElementById("uname")!.style.border = "1px solid";
      document.getElementById("uname")!.style.borderColor = "#c42929";
      valid = false;
    }

    if (this.password != undefined && this.password.length > 0 && this.password.length <= 10){
      document.getElementById("psw")!.style.border = "0";
      document.getElementById("psw")!.style.borderColor = "#8C9EAE";
    } else {
      document.getElementById("psw")!.style.border = "1px solid";
      document.getElementById("psw")!.style.borderColor = "#c42929";
      valid = false;
    }
    return valid;
  }

}
