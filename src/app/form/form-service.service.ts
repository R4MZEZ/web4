import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {from} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  constructor(private http: HttpClient) {
  }

  url = "http://127.0.0.1:8080/backend-1.0-SNAPSHOT/helloWorld";

  getHello() {
    fetch(this.url,
      {
        method: 'GET',
      }
    ).then(response => {
      if (!response.ok) {
        console.log("fail");
        console.log(response.status);
      } else {
        console.log("success");
        console.log(response.json());
      }
    })

  }
}
