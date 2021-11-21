import {Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";




@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  constructor(private cookieService: CookieService) {
  }

  url = "http://127.0.0.1:8080/backend-1.0-SNAPSHOT";

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
    return fetch(this.url + "/points",
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
}
