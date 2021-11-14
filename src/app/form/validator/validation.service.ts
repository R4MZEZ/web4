import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() {
  }

  validateX(x): boolean {
    if (x != undefined && x <= 2.5 && x >= -2.5) {
      document.getElementById("labelX")!.style.color = "#8C9EAE";
      return true;
    } else {
      document.getElementById("labelX")!.style.color = "#c42929";
      return false;
    }
  }

  validateY(y): boolean {
    if (y != undefined && y <= 5 && y >= -5){
      document.getElementById("labelY")!.style.color = "#8C9EAE";
      return true;
    } else {
      document.getElementById("labelY")!.style.color = "#c42929";
      return false;
    }
      }

  validateR(r): boolean {
    if (r != undefined && r <= 2.5 && r >= 0){
      document.getElementById("labelR")!.style.color = "#8C9EAE";
      return true;
    } else {
      document.getElementById("labelR")!.style.color = "#c42929";
      return false;
    }
  }

}

