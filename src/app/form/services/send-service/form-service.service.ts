import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {


  constructor() {

  }

  url = "http://localhost:31272/backend-1.0-SNAPSHOT";


  sendHttp(mapping: string, args: Map<string, any>): Promise<any> {
    return fetch(this.url + mapping,
      {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(args))
      }
    ).then(response => {
      return response.json();
    })
  }


}
