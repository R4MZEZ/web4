import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.css']
})
export class LoggingComponent implements OnInit {
  username: String;
  password: String;
  loginURL = "http://127.0.0.1:8080/backend-1.0-SNAPSHOT/login"
  registerURL = "http://127.0.0.1:8080/backend-1.0-SNAPSHOT/register"


  constructor(private router: Router,
              private cookieService: CookieService) { }

  ngOnInit(): void {
  }


  login() {
    if (this.validateForm()){
      fetch(this.loginURL,
        {
          method: 'POST',
          body: JSON.stringify({username: this.username, password: this.password})
        }
      ).then(response => {
        if (!response.ok) {
          console.log("fail");
          return response.status;
        } else {
          console.log("success");
          return response.json();
        }

      }).then((result) =>{
        if (result.authorized){
          this.cookieService.set("logged","true")
          this.router.navigate(['/']);
        }else {
          alert(result.message)
        }

      })


    }

  }

  register() {

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
