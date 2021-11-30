import {Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {sha256} from "js-sha256";




@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  constructor(private cookieService: CookieService) {
  }

  url = "http://127.0.0.1:8080/backend-1.0-SNAPSHOT";
  checkRoleURL = this.url + "/checkRole"
  getUsersURL = this.url + "/getUsers"
  getPointsURL = this.url + "/points"
  changeUserURL = this.url + "/fakeLogin"

  sendCoordinates(x, y, r) : Promise<any>{
    return fetch(this.url + "/checkPoint",
      {
        method: 'POST',
        body: JSON.stringify({x: x, y: y, r: r, token: this.cookieService.get("currentUser")})
      }
    ).then(response => {
      if (!response.ok) {
        console.log("fail");
        return response.status;
      } else {
        console.log("success");
        return response.json();
      }

      })


  }

  clear() : Promise<any>{
    return fetch(this.url + "/clear",
      {
        method: 'POST',
        body: JSON.stringify({token: this.cookieService.get("currentUser")})
      }
    ).then(response => {
      if (!response.ok) {
        return response.status;
      } else {
        return response.json();
      }
    })


  }

  getPoints(): Promise<any>{
    return fetch(this.getPointsURL,
      {
        method: 'POST',
        body: JSON.stringify({token: this.cookieService.get("currentUser")})
      }
    ).then(response => {
      if (!response.ok) {
        return response.status;
      } else {
        return response.json();
      }
    })
  }

  getRole() : Promise<any>{
    let user;
    if (this.cookieService.get("moderUser") != "")
      user = this.cookieService.get("moderUser");
    else
      user = this.cookieService.get("currentUser");

      return fetch(this.checkRoleURL,
        {
          method: 'POST',
          body: JSON.stringify({token: user})
        }
      ).then(response => {
        if (!response.ok) {
          console.log("fail");
          return response.status;
        } else {
          console.log("success");
          return response.json();
        }

      })
  }

  getUsers() : Promise<any>{

    return fetch(this.getUsersURL,
      {
        method: 'POST'
      }
    ).then(response => {
      if (!response.ok) {
        return response.status;
      } else {
        return response.json();
      }
    })
  }

  changeUser(username) : Promise<any>{
    return fetch(this.changeUserURL,
      {
        method: 'POST',
        body: JSON.stringify({moderator: this.cookieService.get("moderUser"), username: username})
      }
    ).then(response => {
      if (!response.ok) {
        console.log("fail");
        return response.status;
      } else {
        console.log("success");
        return response.json();
      }

    })
  }
}
