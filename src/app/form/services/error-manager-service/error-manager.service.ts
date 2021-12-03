import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ErrorManagerService {

  constructor(private cookieService: CookieService,
              private router: Router) { }

  manageErrCode(errCode) {
    switch (errCode) {
      case 3: {
        this.cookieService.delete("currentUser");
        this.cookieService.set("message", "Время сессии истекло, пожалуйста, выполните повторную авторизацию")
        this.router.navigate(['/login']);
        break;
      }
      case 4: {
        this.cookieService.delete("currentUser");
        this.cookieService.set("message", "хелиос упал брат")
        this.router.navigate(['/login']);
        break;
      }
    }
  }
}
