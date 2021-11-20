import {Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  public currentUserSubject;


  constructor(private cookieService: CookieService) {
    try {
      this.currentUserSubject = JSON.parse(cookieService.get('currentUser'));
    }catch (SyntaxError){
      this.currentUserSubject = null;
    }
  }
}
