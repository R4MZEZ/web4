import {Injectable} from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  constructor() {
  }

  url = "http://127.0.0.1:8080/backend-1.0-SNAPSHOT/checkPoint";

  sendCoordinates(x, y, r) : Promise<any>{
    return fetch(this.url,
      {
        method: 'POST',
        body: JSON.stringify({x: x, y: y, r: r})
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
