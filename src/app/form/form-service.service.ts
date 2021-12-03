import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {


  constructor() {

  }

  url = "http://127.0.0.1:8080/backend-1.0-SNAPSHOT";


  sendHttp(mapping: string, args: Map<string, any>) : Promise<any>{
    return fetch(this.url + mapping,
      {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(args))
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
