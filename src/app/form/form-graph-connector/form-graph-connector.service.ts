import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormGraphConnectorService {
  public x$ = new Subject<number>();
  public y$ = new Subject<number>();
  public r$ = new Subject<number>();
  public selectedR$ = new Subject<number>();

  public point$ = new Subject<any>();

  public changeValues(x: number, y: number, r: number) {
    this.x$.next(x);
    this.y$.next(y);
    this.r$.next(r);
  }

  public updatePoint(point: any){
    this.point$.next(point);
  }

  public changeSelectedR(r: number){
    this.selectedR$.next(r);
  }

  constructor() { }
}
